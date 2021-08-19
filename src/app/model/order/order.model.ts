import {ShippingModel} from './shipping.model';
import {InvoiceIdentifierModel} from './invoice-identifier.model';
import {Moment} from 'moment';

export type Status = 'pending' | 'processing' | 'on-hold' | 'completed' | 'cancelled' | 'refunded' | 'failed' | 'trash';

export interface OrderModel {
  id: number;
  number: string;
  title: string;
  status: Status;
  date: Moment;
  currency: string;
  total: number;
  weightInGrams: number;
  shipping: ShippingModel;
  paymentMethod: 'paypal' | 'bacs';
  invoiceRegular: InvoiceIdentifierModel;
  invoiceProforma: InvoiceIdentifierModel;
}
