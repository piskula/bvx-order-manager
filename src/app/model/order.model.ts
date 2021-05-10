import {InvoiceModel} from './invoice.model';
import {TagModel} from './tag.model';
import {ClientModel} from './client.model';

export interface OrderModel {
  invoice: InvoiceModel;
  tags: TagModel[];
  isSent: boolean;
  client: ClientModel;
}
