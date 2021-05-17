import {OrderAddressModel} from './order-address.model';

export interface ShippingModel {
  id: string;
  type: string;
  title: string;
  address: OrderAddressModel;
}
