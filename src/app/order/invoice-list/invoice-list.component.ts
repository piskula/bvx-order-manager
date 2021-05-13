import {Component, OnInit} from '@angular/core';
import {InvoiceService} from '../../service/invoice.service';
import {finalize, take, tap} from 'rxjs/operators';
import {SuperInvoiceModel} from '../../model/invoice/super-invoice.model';

@Component({
  selector: 'app-order-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
  providers: [InvoiceService],
})
export class InvoiceListComponent implements OnInit {

  list: SuperInvoiceModel[] = [];
  isLoading = false;

  displayedColumns: string[] = ['invoice_id', 'name', 'amount', 'status', 'order', 'country'];

  constructor(private invoiceService: InvoiceService) {
  }

  ngOnInit(): void {
    this.resetList();
  }

  private resetList(): void {
    this.isLoading = true;
    this.invoiceService.getList()
      .pipe(
        take(1),
        tap(list => this.list = list),
        finalize(() => this.isLoading = false),
      ).subscribe();
  }

}
