import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {InvoiceModel, StatusModel} from '../model/invoice/invoice.model';
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

  getList(customFilterString: string = ''): Observable<SuperInvoiceModel[]> {
    return this.httpClient.request<any>(
      'get',
      `${this.URL}/invoices/index.json${customFilterString}`,
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
    const proformaId = invoice?.Invoice?.proforma_id;
    const relatedItems: any[] = (invoice?.RelatedItems?.map(item => item?.Invoice) || []);
    const proformaTitle = !proformaId ? null : relatedItems.find(x => x.id === proformaId)?.invoice_no_formatted;

    const parentRegular = invoice?.Parent?.Invoice;

    return {
      invoice: {
        id: invoice?.Invoice?.id,
        number: invoice?.Invoice?.invoice_no_formatted,
        type: invoice?.Invoice?.type,
        proformaId,
        proformaTitle,
        parentRegularId: parentRegular?.id,
        parentRegularTitle: parentRegular?.invoice_no_formatted,
        paymentType: invoice?.Invoice?.payment_type,
        orderNr: invoice?.Invoice?.order_no,
        amount: parseFloat(invoice?.Invoice?.amount),
        currency: invoice?.Invoice?.invoice_curreny,
        flag: invoice?.Invoice?.flag,
        status: this.statusToIcon(invoice?.Invoice?.status),
      } as InvoiceModel,
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

  private statusToIcon(status: '1' | '2' | '3' | '99'): StatusModel {
    let statusIcon = '';
    let statusTitle = '';
    switch (status) {
      case '1': // issued
        statusIcon = 'radio_button_unchecked';
        statusTitle = 'Awaiting payment';
        break;
      case '2': // partially-paid
        statusIcon = 'nightlight';
        statusTitle = 'Partially paid';
        break;
      case '3': // paid
        statusIcon = 'check_circle';
        statusTitle = 'Paid';
        break;
    }

    return {
      status,
      statusIcon,
      statusTitle,
    };
  }

}
