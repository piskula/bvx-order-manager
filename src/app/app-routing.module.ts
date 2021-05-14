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
        path: 'detail/:invoiceId',
        component: InvoiceDetailComponent,
      },
      {
        path: 'list',
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'regular',
          },
          {
            path: 'regular',
            component: InvoiceListComponent,
            data: {filterString: '/type:regular'},
          },
          {
            path: 'proforma',
            component: InvoiceListComponent,
            data: {filterString: '/type:proforma'},
          },
        ]
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
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'all',
          },
          {
            path: 'all',
            component: OrderListComponent,
          },
          {
            path: 'processing',
            component: OrderListComponent,
            data: {filterString: 'status=processing'},
          },
          {
            path: 'on-hold',
            component: OrderListComponent,
            data: {filterString: 'status=on-hold'},
          },
          {
            path: 'cancelled',
            component: OrderListComponent,
            data: {filterString: 'status=cancelled'},
          },
        ]
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
