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
import {SnackbarService} from '../../common/snackbar/snackbar.service';

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
  loadingPaymentMarking = false;
  loadingPaymentRemoval = false;

  constructor(
    private invoiceService: InvoiceService,
    private activatedRoute: ActivatedRoute,
    private skPostService: SkPostService,
    private packetaService: PacketaService,
    private snackbarService: SnackbarService,
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
        tap(sheetId => this.snackbarService.showSuccessSheetIdMessage(sheetId)),
        catchError(err => {
          this.snackbarService.showErrorMessage('Error creating SK Post sheet', err);
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
        tap(barcode => this.snackbarService.showSimpleSuccess(`Parcel ${barcode} registered!`)),
        catchError(err => {
          this.snackbarService.showErrorMessage('Error registering package', err);
          return throwError(err);
        }),
        finalize(() => this.loadingPacketa = false),
      ).subscribe();
  }

  markAsPaid(): void {
    this.loadingPaymentMarking = true;
    this.invoiceService.payInvoice(this.invoiceId)
      .pipe(
        take(1),
        tap(response => {
          if (response.error !== 0) {
            this.snackbarService.showErrorMessage(response.message);
          } else {
            this.snackbarService.showSimpleSuccess(response.flash_message.text);
            this.resetDetail();
          }
        }),
        finalize(() => this.loadingPaymentMarking = false),
      ).subscribe();
  }

  removePayment(paymentId): void {
    this.loadingPaymentRemoval = true;
    this.invoiceService.revertInvoicePayment(paymentId)
      .pipe(
        take(1),
        tap(response => {
          if (response?.error !== 0) {
            this.snackbarService.showErrorMessage(response?.message);
          } else {
            this.snackbarService.showSimpleSuccess('Payment removed');
            this.resetDetail();
          }
        }),
        finalize(() => this.loadingPaymentRemoval = false),
      ).subscribe();
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
