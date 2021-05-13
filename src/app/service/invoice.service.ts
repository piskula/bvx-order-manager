import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {InvoiceModel} from '../model/invoice/invoice.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {SuperInvoiceModel} from '../model/invoice/super-invoice.model';
import {TagModel} from '../model/invoice/tag.model';
import {environment} from '../../environments/environment';
import {ItemModel} from '../model/invoice/item.model';

@Injectable()
export class InvoiceService {

  private URL = environment.superFaktura.url;
  private AUTH_HEADER = environment.superFaktura.authHeader;

  private headers = new HttpHeaders();

  constructor(private httpClient: HttpClient) {
    this.headers = this.headers.set('Authorization', this.AUTH_HEADER);
  }

  getList(): Observable<SuperInvoiceModel[]> {
    return this.httpClient.request<any>(
      'get',
      `${this.URL}/invoices/index.json/type:proforma`,
      {headers: this.headers})
      .pipe(
        map((invoices: any[]) => invoices.map(invoice => this.mapInvoice(invoice))),
      );
  }

  detail(invoiceId: number): Observable<SuperInvoiceModel> {
    return this.httpClient.request<any>(
      'get',
      `${this.URL}/invoices/view/${invoiceId}.json`,
      {headers: this.headers})
      .pipe(
        map((invoice: any) => this.mapInvoice(invoice)),
      );
  }

  private mapInvoice(invoice: any): SuperInvoiceModel {
    const tags: TagModel[] = invoice?.Tag?.map(tag => ({id: tag.Tag.id, name: tag.Tag.name} as TagModel));
    return {
      invoice: {
        id: invoice?.Invoice?.id,
        type: invoice?.Invoice?.type,
        proformaId: invoice?.Invoice?.proforma_id,
        orderNr: invoice?.Invoice?.order_no,
        amount: parseFloat(invoice?.Invoice?.amount),
        currency: invoice?.Invoice?.invoice_curreny,
        flag: invoice?.Invoice?.flag,
      } as InvoiceModel,
      tags,
      isSent: !!tags?.length,
      client: {
        name: invoice?.ClientData?.name,
        email: invoice?.ClientData?.email,
        phone: invoice?.ClientData?.phone,
        deliveryAddress: {
          name: invoice?.ClientData?.name,
          addressLine: invoice?.ClientData?.address,
          city: invoice?.ClientData?.city,
          zip: invoice?.ClientData?.zip,
          country: {
            iso: invoice?.ClientData?.Country?.iso,
            id: invoice?.ClientData?.Country?.id,
            name: invoice?.ClientData?.Country?.name,
          },
        },
      },
      items: invoice?.InvoiceItem?.map(item => ({
        title: item?.name,
        description: item?.description,
        quantity: item?.quantity,
        totalPrice: item?.item_price,
        unitPrice: item?.unit_price,
      } as ItemModel)),
    };
  }

}
