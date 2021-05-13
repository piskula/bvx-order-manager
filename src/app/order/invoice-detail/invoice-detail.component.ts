import {Component, OnInit} from '@angular/core';
import {InvoiceService} from '../../service/invoice.service';
import {ActivatedRoute} from '@angular/router';
import {SuperInvoiceModel} from '../../model/invoice/super-invoice.model';
import {finalize, take, tap} from 'rxjs/operators';

@Component({
  selector: 'app-order-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.scss'],
  providers: [InvoiceService],
})
export class InvoiceDetailComponent implements OnInit {

  invoice: SuperInvoiceModel;
  isLoading = false;
  invoiceId = this.activatedRoute?.snapshot?.params?.invoiceId;

  displayedColumns: string[] = ['quantity', 'title', 'unitPrice', 'totalPrice'];

  constructor(
    private invoiceService: InvoiceService,
    private activatedRoute: ActivatedRoute,
  ) {
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
        finalize(() => this.isLoading = false),
      ).subscribe();
  }

}
