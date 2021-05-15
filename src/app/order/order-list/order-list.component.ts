import {Component, OnDestroy, OnInit} from '@angular/core';
import {finalize, map, take, takeUntil, tap} from 'rxjs/operators';
import {OrderService} from '../../service/order.service';
import {OrderModel} from '../../model/order/order.model';
import {SelectionModel} from '@angular/cdk/collections';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseComponent} from '../../common/base-component/base.component';
import {SendOrdersStore} from '../../service/helper/send-orders.store';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  providers: [OrderService],
})
export class OrderListComponent extends BaseComponent implements OnInit, OnDestroy {

  filterString = this.activatedRoute?.snapshot?.data?.filterString || '';
  list: OrderModel[] = [];
  isLoading = false;

  selectedPacketa = 0;
  selectedPost = 0;
  selectedCourier = 0;

  displayedColumns: string[] = ['select', 'number', 'title', 'date', 'shipping', 'total', 'invoice', 'arrow', 'invoice-proforma'];
  selection = new SelectionModel<OrderModel>(true, []);
  disabledStatuses = ['cancelled', 'refunded', 'failed', 'trash'];

  constructor(
    private orderService: OrderService,
    private sendOrdersStore: SendOrdersStore,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    super();
  }

  ngOnInit(): void {
    this.resetList();
    this.selection.changed
      .pipe(
        map(changes => changes.source.selected),
        tap((selected: OrderModel[]) => this.selectedPost = selected.filter(x => ['4'].includes(x.shipping.id)).length),
        tap((selected: OrderModel[]) => this.selectedPacketa = selected.filter(x => ['2', '5'].includes(x.shipping.id)).length),
        tap((selected: OrderModel[]) => this.selectedCourier = selected.filter(x => ['6', '9'].includes(x.shipping.id)).length),
        takeUntil(this.destroyed$),
      ).subscribe();
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

  send(): void {
    this.sendOrdersStore.orders = this.selection.selected;
    this.router.navigate(['order', 'send']);
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  private resetList(): void {
    this.isLoading = true;
    this.orderService.getList(this.filterString)
      .pipe(
        tap(list => this.list = list),
        finalize(() => this.isLoading = false),
        takeUntil(this.destroyed$),
      ).subscribe();
  }

}
