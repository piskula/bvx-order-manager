import {Component, OnInit} from '@angular/core';
import {finalize, take, tap} from 'rxjs/operators';
import {OrderService} from '../../service/order.service';
import {OrderModel} from '../../model/order/order.model';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  providers: [OrderService],
})
export class OrderListComponent implements OnInit {

  list: OrderModel[] = [];
  isLoading = false;

  displayedColumns: string[] = ['number', 'title', 'shipping', 'total'];

  constructor(private orderService: OrderService) {
  }

  ngOnInit(): void {
    this.resetList();
    const emptyArr = [];
  }

  private resetList(): void {
    this.isLoading = true;
    this.orderService.getList()
      .pipe(
        take(1),
        tap(list => this.list = list),
        finalize(() => this.isLoading = false),
      ).subscribe();
  }

}
