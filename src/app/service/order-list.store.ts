import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {InvoiceModel} from '../model/invoice.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {OrderModel} from '../model/order.model';
import {TagModel} from '../model/tag.model';
import {ClientModel} from '../model/client.model';
import {AddressModel} from '../model/address.model';

@Injectable()
export class OrderListStore {

  data$: Observable<OrderModel[]>;

  constructor(private httpClient: HttpClient) {
    this.data$ = this.page();
  }

  private page(): Observable<OrderModel[]> {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', '');

    return this.httpClient.request<any>(
      'get',
      'http://localhost:4200/mojafaktura/invoices/index.json/type:proforma',
      {headers})
      .pipe(
        map((orders: any[]) => orders.map(order => this.mapOrder(order))),
      );
  }

  detail(orderId: number): Observable<OrderModel> {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', '');

    return this.httpClient.request<any>(
      'get',
      'http://localhost:4200/mojafaktura/invoices/view/' + orderId + '.json',
      {headers})
      .pipe(
        map((order: any) => this.mapOrder(order)),
      );
  }

  private mapOrder(order: any): OrderModel {
    const tags: TagModel[] = order?.Tag?.map(tag => ({id: tag.Tag.id, name: tag.Tag.name} as TagModel));
    return {
      invoice: {
        id: order?.Invoice?.id,
        proformaId: order?.Invoice?.proforma_id,
        orderNr: order?.Invoice?.order_no,
        amount: parseFloat(order?.Invoice?.amount),
      } as InvoiceModel,
      tags,
      isSent: !!tags?.length,
      client: {
        name: order?.ClientData?.name,
        email: order?.ClientData?.email,
        deliveryAddress: {
          name: order?.ClientData?.address,
          city: order?.ClientData?.city,
          zip: order?.ClientData?.zip,
          country: order?.ClientData?.country_iso_id,
        } as AddressModel,
      } as ClientModel,
    } as OrderModel;
  }

}
