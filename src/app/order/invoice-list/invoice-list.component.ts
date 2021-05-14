import {Component, OnInit} from '@angular/core';
import {InvoiceService} from '../../service/invoice.service';
import {finalize, take, tap} from 'rxjs/operators';
import {SuperInvoiceModel} from '../../model/invoice/super-invoice.model';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-order-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
  providers: [InvoiceService],
})
export class InvoiceListComponent implements OnInit {

  filterString = this.activatedRoute?.snapshot?.data?.filterString || '';
  list: SuperInvoiceModel[] = [];
  isLoading = false;

  displayedColumns: string[] = ['invoice_nr', 'status', 'name', 'amount', 'paymentType', 'order', 'country', 'link'];

  constructor(
    private invoiceService: InvoiceService,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.resetList();
  }

  private resetList(): void {
    this.isLoading = true;
    this.invoiceService.getList(this.filterString)
      .pipe(
        take(1),
        tap(list => this.list = list),
        finalize(() => this.isLoading = false),
      ).subscribe();
  }

}
