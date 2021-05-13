import {ShippingModel} from './shipping.model';
import {InvoiceIdentifierModel} from './invoice-identifier.model';
import {Moment} from 'moment';

export interface OrderModel {
  number: string;
  title: string;
  status: 'pending' | 'processing' | 'on-hold' | 'completed' | 'cancelled' | 'refunded' | 'failed' | 'trash';
  date: Moment;
  currency: string;
  total: number;
  shipping: ShippingModel;
  paymentMethod: 'paypal' | 'bacs';
  invoiceRegular: InvoiceIdentifierModel;
  invoiceProforma: InvoiceIdentifierModel;
}
