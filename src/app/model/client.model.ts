import {AddressModel} from './address.model';

export interface ClientModel {
  name: string;
  email: string;
  deliveryAddress: AddressModel;
}
