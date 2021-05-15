import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {OrderModel} from '../model/order/order.model';
import {InvoiceIdentifierModel} from '../model/order/invoice-identifier.model';
import * as moment from 'moment';

@Injectable()
export class OrderService {

  private URL = environment.wooCommerce.url;
  private API_KEY = environment.wooCommerce.apiKey;
  private SECRET = environment.wooCommerce.secret;

  private headers = new HttpHeaders();

  constructor(private httpClient: HttpClient) {
    this.headers = this.headers.set('Authorization', 'Basic ' + window.btoa(`${this.API_KEY}:${this.SECRET}`));
  }

  getList(customFilterString: string = ''): Observable<OrderModel[]> {
    return this.httpClient.request<any[]>(
      'get',
      `${this.URL}/orders?per_page=20&orderby=date&order=desc&${customFilterString}`,
      {headers: this.headers})
      .pipe(
        map((orders: any[]) => orders.map(order => this.mapOrder(order))),
      );
  }

  private mapOrder(order: any): OrderModel {
    const shipping = (order?.shipping_lines || [])[0];
    const metadata: any[] = order?.meta_data || [];
    return {
      number: order?.number,
      title: `${order?.billing?.first_name} ${order?.billing?.last_name}`,
      status: order?.status,
      date: moment.utc(order?.date_created_gmt),
      currency: order?.currency,
      total: parseFloat(order?.total),
      shipping: {
        id: shipping?.instance_id,
        type: shipping?.method_id,
        title: shipping?.method_title,
      },
      paymentMethod: order?.payment_method,
      invoiceRegular: this.getInvoiceFromMetadata(metadata, 'regular'),
      invoiceProforma: this.getInvoiceFromMetadata(metadata, 'proforma'),
    };
  }

  private getInvoiceFromMetadata(metadata: any[], type: string): InvoiceIdentifierModel | null {
    const id = metadata.find(x => x.key === `wc_sf_internal_${type}_id`)?.value;
    const invoiceNumber = metadata.find(x => x.key === `wc_sf_${type}_invoice_number`)?.value;
    if (id && invoiceNumber) {
      return {id, number: invoiceNumber};
    } else {
      return null;
    }
  }

}
