import {Component} from '@angular/core';
import {OrderModel} from '../../model/order/order.model';
import {SendOrdersStore} from '../../service/helper/send-orders.store';
import {SkPostService} from '../../service/sk-post.service';
import {catchError, finalize, take, tap} from 'rxjs/operators';
import {forkJoin, of, throwError} from 'rxjs';
import {OrderService} from '../../service/order.service';
import {PacketaService} from '../../service/packeta.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SnackbarService} from '../../common/snackbar/snackbar.service';

@Component({
  selector: 'app-send-orders',
  templateUrl: './send-orders.component.html',
  styleUrls: ['./send-orders.component.scss'],
  providers: [SkPostService, PacketaService, OrderService],
})
export class SendOrdersComponent {

  orders: OrderModel[] = [];

  ordersSlovakPost: OrderModel[] = [];
  ordersPickUpPoints: OrderModel[] = [];
  ordersCourier: OrderModel[] = [];

  successSkPosta = false;
  loadingSkPosta = false;

  successPacketa = false;
  loadingPacketa = false;
  packetaParcelsNumberOfDone = 0;
  packetaParcelsErrors: string[] = [];
  packetaParcelsErrored: OrderModel[] = [];

  statusesUpdateNumberOfDone = 0;
  statusesUpdateErrors: OrderModel[] = [];
  statusesUpdateOngoing = false;

  constructor(
    private sendOrdersStore: SendOrdersStore,
    private skPostService: SkPostService,
    private packetaService: PacketaService,
    private orderService: OrderService,
    private snackBar: MatSnackBar,
    private snackbarService: SnackbarService,
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
        tap(sheetId => this.snackbarService.showSuccessSheetIdMessage(sheetId)),
        tap(() => this.successSkPosta = true),
        catchError(err => {
          this.snackbarService.showErrorMessage(err);
          return throwError(err);
        }),
        finalize(() => this.loadingSkPosta = false),
      ).subscribe();
  }

  registerPacketaParcels(): void {
    this.loadingPacketa = true;
    forkJoin(
      this.ordersCourier.concat(this.ordersPickUpPoints).map(order =>
        this.packetaService.registerPackage(order)
          .pipe(
            tap(barcode => console.log('Packet registered: ' + barcode)),
            tap(() => this.packetaParcelsNumberOfDone++),
            catchError((err) => {
              this.packetaParcelsErrors = this.packetaParcelsErrors.concat(err);
              this.packetaParcelsErrored.push(order);
              return of(undefined);
            }),
          )
      )
    ).pipe(
      tap(() => this.successPacketa = this.packetaParcelsErrored.length === 0),
      finalize(() => this.loadingPacketa = false),
    ).subscribe();
  }

  updateStatusesInWpToCompleted(): void {
    this.statusesUpdateOngoing = true;
    forkJoin(
      this.orders.map(order =>
        this.orderService.changeStatus(order.id, 'completed')
          .pipe(
            tap(() => this.statusesUpdateNumberOfDone++),
            catchError((err) => {
              this.statusesUpdateErrors.push(order);
              console.error(err);
              return of(undefined);
            }),
          )
      )
    ).pipe(
      finalize(() => this.statusesUpdateOngoing = false),
    ).subscribe();
  }

}
