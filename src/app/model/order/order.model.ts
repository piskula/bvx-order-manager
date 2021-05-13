import {ShippingModel} from './shipping.model';

export interface OrderModel {
  number: string;
  title: string;
  currency: string;
  total: number;
  shipping: ShippingModel;
  paymentMethod: 'paypal' | 'bacs';
}
