import {InvoiceModel} from './invoice.model';
import {ClientModel} from './client.model';
import {ItemModel} from './item.model';

export interface SuperInvoiceModel {
  invoice: InvoiceModel;
  client: ClientModel;
  items: ItemModel[];
}
