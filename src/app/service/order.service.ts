import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {InvoiceModel} from '../model/invoice/invoice.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {SuperInvoiceModel} from '../model/invoice/super-invoice.model';
import {TagModel} from '../model/invoice/tag.model';
import {environment} from '../../environments/environment';
import {ItemModel} from '../model/invoice/item.model';
import {OrderModel} from '../model/order/order.model';

@Injectable()
export class OrderService {

  private URL = environment.wooCommerce.url;
  private API_KEY = environment.wooCommerce.apiKey;
  private SECRET = environment.wooCommerce.secret;

  private headers = new HttpHeaders();

  constructor(private httpClient: HttpClient) {
    this.headers = this.headers.set('Authorization', 'Basic ' + window.btoa(`${this.API_KEY}:${this.SECRET}`));
  }

  getList(): Observable<OrderModel[]> {
    return this.httpClient.request<any[]>(
      'get',
      `${this.URL}/orders?per_page=20&orderby=date&order=desc`,
      {headers: this.headers})
      .pipe(
        map((orders: any[]) => orders.map(order => this.mapOrder(order))),
      );
  }

  private mapOrder(order: any): OrderModel {
    const shipping = (order?.shipping_lines || [])[0];
    return {
      number: order?.number,
      title: `${order?.billing?.first_name} ${order?.billing?.last_name}`,
      currency: order?.currency,
      total: parseFloat(order?.total),
      shipping: {
        id: shipping?.instance_id,
        type: shipping?.method_id,
        title: shipping?.method_title,
      },
      paymentMethod: order?.payment_method,
    };
  }

}
