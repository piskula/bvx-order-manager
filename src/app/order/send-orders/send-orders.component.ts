import {Component} from '@angular/core';
import {OrderModel} from '../../model/order/order.model';
import {SendOrdersStore} from '../../service/helper/send-orders.store';
import {SkPostService} from '../../service/sk-post.service';
import {catchError, finalize, take, tap} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Component({
  selector: 'app-send-orders',
  templateUrl: './send-orders.component.html',
  styleUrls: ['./send-orders.component.scss'],
  providers: [SkPostService],
})
export class SendOrdersComponent {

  orders: OrderModel[] = [];

  ordersSlovakPost: OrderModel[] = [];
  ordersPickUpPoints: OrderModel[] = [];
  ordersCourier: OrderModel[] = [];

  successSkPosta = false;
  errorSkPosta = false;
  loadingSkPosta = false;
  skPostSheetId = null;

  successPacketa = false;
  errorPacketa = false;
  loadingPacketa = false;

  constructor(
    private sendOrdersStore: SendOrdersStore,
    private skPostService: SkPostService,
  ) {
    this.orders = this.sendOrdersStore.orders;

    this.ordersSlovakPost = this.orders.filter(x => x.shipping.id === '4');
    this.ordersPickUpPoints = this.orders.filter(x => ['2', '5'].includes(x.shipping.id));
    this.ordersCourier = this.orders.filter(x => ['6', '9'].includes(x.shipping.id));

    if (this.ordersSlovakPost.length <= 0) {
      this.successSkPosta = true;
    }
    if (this.ordersPickUpPoints.length <= 0 && this.ordersCourier.length <= 0) {
      this.successPacketa = true;
    }

    this.sendOrdersStore.orders = [];
  }

  registerSkPostParcels(): void {
    this.loadingSkPosta = true;
    this.skPostService.importSheet(this.ordersSlovakPost)
      .pipe(
        take(1),
        tap(sheetId => this.skPostSheetId = sheetId),
        tap(() => this.successSkPosta = true),
        catchError(err => {
          this.errorSkPosta = true;
          return throwError(err);
        }),
        finalize(() => this.loadingSkPosta = false),
      ).subscribe();
  }

}
