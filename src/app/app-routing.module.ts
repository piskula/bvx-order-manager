import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AboutComponent} from './about/about.component';
import {InvoiceListComponent} from './order/invoice-list/invoice-list.component';
import {InvoiceDetailComponent} from './order/invoice-detail/invoice-detail.component';
import {OrderListComponent} from './order/order-list/order-list.component';

const routes: Routes = [
  {
    path: 'invoice',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list',
      },
      {
        path: 'list',
        component: InvoiceListComponent,
      },
      {
        path: 'detail/:invoiceId',
        component: InvoiceDetailComponent,
      },
    ],
  },
  {
    path: 'order',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list',
      },
      {
        path: 'list',
        component: OrderListComponent,
      },
    ],
  },
  {
    path: 'about',
    component: AboutComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
