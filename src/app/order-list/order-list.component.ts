import { Component } from '@angular/core';
import {OrderListStore} from '../service/order-list.store';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  providers: [OrderListStore],
})
export class OrderListComponent {

  displayedColumns: string[] = ['invoice_id', 'order'];

  constructor(public orderListStore: OrderListStore) {
  }
}
