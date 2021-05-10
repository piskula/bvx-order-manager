import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AboutComponent} from './about/about.component';
import {OrderListComponent} from './order/order-list/order-list.component';
import {OrderDetailComponent} from './order/order-detail/order-detail.component';

const routes: Routes = [
  {
    path: 'orderList',
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
      {
        path: 'detail/:orderId',
        component: OrderDetailComponent,
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
