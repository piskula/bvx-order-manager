import {Injectable} from '@angular/core';
import {OrderModel} from '../../model/order/order.model';

@Injectable()
export class SendOrdersStore {

  orders: OrderModel[] = [];

}
