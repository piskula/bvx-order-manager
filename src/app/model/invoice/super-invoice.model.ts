import {InvoiceModel} from './invoice.model';
import {TagModel} from './tag.model';
import {ClientModel} from './client.model';
import {ItemModel} from './item.model';

export interface SuperInvoiceModel {
  invoice: InvoiceModel;
  tags: TagModel[];
  isSent: boolean;
  client: ClientModel;
  items: ItemModel[];
}
