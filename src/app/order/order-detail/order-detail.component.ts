import {Component, OnInit} from '@angular/core';
import {OrderListStore} from '../../service/order-list.store';
import {ActivatedRoute} from '@angular/router';
import {OrderModel} from '../../model/order.model';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
  providers: [OrderListStore],
})
export class OrderDetailComponent implements OnInit {

  order: OrderModel;
  orderId = this.activatedRoute?.snapshot?.params?.orderId;

  constructor(
    private orderListStore: OrderListStore,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.orderListStore.detail(this.orderId)
      .subscribe(order => this.order = order);
  }

}
