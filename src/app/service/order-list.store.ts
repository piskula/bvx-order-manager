import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {InvoiceModel} from '../model/invoice.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {OrderModel} from '../model/order.model';

@Injectable()
export class OrderListStore {

  data$: Observable<OrderModel[]>;

  constructor(private httpClient: HttpClient) {
    this.data$ = this.page();
  }

  private page(): Observable<OrderModel[]> {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'TODO');

    return this.httpClient.request<any>(
      'get',
      'http://localhost:4200/mojafaktura/invoices/index.json/type:regular',
      { headers })
      .pipe(
        map((orders: any[]) => orders.map(order => ({
          invoice: {
            id: order?.Invoice?.id,
            proformaId: order?.Invoice?.proforma_id,
            orderNr: order?.Invoice?.order_no,
          } as InvoiceModel
        } as OrderModel))),
      );
  }

}
