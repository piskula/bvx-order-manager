import {AddressModel} from './address.model';

export interface ClientModel {
  name: string;
  email: string;
  phone: string;
  deliveryAddress: AddressModel;
}
