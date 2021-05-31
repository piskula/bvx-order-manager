import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {catchError, finalize, take, takeUntil, tap} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {InvoiceService} from '../../service/invoice.service';
import {SuperInvoiceModel} from '../../model/invoice/super-invoice.model';
import {BaseComponent} from '../../common/base-component/base.component';
import {SkPostService} from '../../service/sk-post.service';
import {PacketaService} from '../../service/packeta.service';
import {OrderModel} from '../../model/order/order.model';
import {ShippingModel} from '../../model/order/shipping.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SheetSnackbarComponent} from '../../common/snackbar/sheet.snackbar';

@Component({
  selector: 'app-order-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.scss'],
  providers: [InvoiceService, SkPostService, PacketaService],
})
export class InvoiceDetailComponent extends BaseComponent implements OnInit, OnDestroy {

  invoice: SuperInvoiceModel;
  isLoading = false;
  invoiceId = this.activatedRoute?.snapshot?.params?.invoiceId;
  errorMsg = null;

  displayedColumns: string[] = ['quantity', 'title', 'unitPrice', 'totalPrice'];

  loadingSkPosta = false;
  loadingPacketa = false;

  constructor(
    private invoiceService: InvoiceService,
    private activatedRoute: ActivatedRoute,
    private skPostService: SkPostService,
    private packetaService: PacketaService,
    private snackBar: MatSnackBar,
  ) {
    super();
  }

  ngOnInit(): void {
    this.resetDetail();
  }

  private resetDetail(): void {
    this.isLoading = true;
    this.invoiceService.detail(this.invoiceId)
      .pipe(
        take(1),
        tap(detail => this.invoice = detail),
        catchError((err: HttpErrorResponse) => {
          console.error(err);
          if (err.status === 404) {
            this.errorMsg = `Invoice ${this.invoiceId} cannot be found in SuperFaktura. Maybe it was removed already?`;
          } else {
            this.errorMsg = `There was problem retrieving invoice ${this.invoiceId}.`;
          }
          return throwError(err);
        }),
        finalize(() => this.isLoading = false),
        takeUntil(this.destroyed$),
      ).subscribe();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  registerSkPostParcel(): void {
    this.loadingSkPosta = true;
    this.skPostService.importSheet([this.getOrderFromInvoice()])
      .pipe(
        take(1),
        tap(sheetId => this.skPostService.showSuccessSheetIdMessage(sheetId)),
        catchError(err => {
          this.showErrorMessage(err);
          return throwError(err);
        }),
        finalize(() => this.loadingSkPosta = false),
      ).subscribe();
  }

  registerPacketaParcel(): void {
    this.loadingPacketa = true;
    this.packetaService.registerPackage(this.getOrderFromInvoice())
      .pipe(
        take(1),
        tap(barcode => this.showSuccessPacketaMessage(barcode)),
        catchError(err => {
          this.showErrorMessage(err);
          return throwError(err);
        }),
        finalize(() => this.loadingPacketa = false),
      ).subscribe();
  }

  private showErrorMessage(extraInfo: string = null): void {
    console.log(extraInfo);
    this.snackBar.open(
      'Error creating sheet',
      'Dismiss',
      {
        panelClass: ['color-bg-red'],
        duration: 3500,
      },
    );
  }

  private showSuccessPacketaMessage(barcode: string): void {
    this.snackBar.open(
      `Parcel ${barcode} registered!`,
      'Dismiss',
      {
        panelClass: ['color-bg-green'],
        duration: 5000,
      },
    );
  }

  private getOrderFromInvoice(): OrderModel {
    return {
      total: this.invoice.invoice.amount,
      number: this.invoice.invoice.number,
      shipping: {
        id: '6', // if sending by Packeta, use courier
        address: {
          firstName: this.invoice.client.deliveryAddress.name,
          lastName: '',
          company: '',
          addressLine1: this.invoice.client.deliveryAddress.addressLine,
          addressLine2: '',
          city: this.invoice.client.deliveryAddress.city,
          zip: this.invoice.client.deliveryAddress.zip,
          country: this.invoice.client.deliveryAddress.country.iso,
          email: this.invoice.client.email,
          phone: this.invoice.client.phone,
        },
      } as ShippingModel,
    } as OrderModel;
  }

}
