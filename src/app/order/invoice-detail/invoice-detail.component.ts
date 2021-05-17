import {Component, OnDestroy, OnInit} from '@angular/core';
import {InvoiceService} from '../../service/invoice.service';
import {ActivatedRoute} from '@angular/router';
import {SuperInvoiceModel} from '../../model/invoice/super-invoice.model';
import {catchError, finalize, take, takeUntil, tap} from 'rxjs/operators';
import {BaseComponent} from '../../common/base-component/base.component';
import {throwError} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-order-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.scss'],
  providers: [InvoiceService],
})
export class InvoiceDetailComponent extends BaseComponent implements OnInit, OnDestroy {

  invoice: SuperInvoiceModel;
  isLoading = false;
  invoiceId = this.activatedRoute?.snapshot?.params?.invoiceId;
  errorMsg = null;

  displayedColumns: string[] = ['quantity', 'title', 'unitPrice', 'totalPrice'];

  constructor(
    private invoiceService: InvoiceService,
    private activatedRoute: ActivatedRoute,
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

}
