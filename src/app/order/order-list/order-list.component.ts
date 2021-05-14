import {Component, OnInit} from '@angular/core';
import {finalize, take, tap} from 'rxjs/operators';
import {OrderService} from '../../service/order.service';
import {OrderModel} from '../../model/order/order.model';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  providers: [OrderService],
})
export class OrderListComponent implements OnInit {

  list: OrderModel[] = [];
  isLoading = false;

  displayedColumns: string[] = ['select', 'number', 'title', 'date', 'shipping', 'total', 'invoice', 'arrow', 'invoice-proforma'];
  selection = new SelectionModel<OrderModel>(true, []);
  disabledStatuses = ['cancelled', 'refunded', 'failed', 'trash'];

  constructor(private orderService: OrderService) {
  }

  ngOnInit(): void {
    this.resetList();
    const emptyArr = [];
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.list.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.list.forEach(row => this.selection.select(row));
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
