import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { InvoiceListComponent } from './order/invoice-list/invoice-list.component';
import {AboutComponent} from './about/about.component';
import {AppRoutingModule} from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import { InvoiceDetailComponent } from './order/invoice-detail/invoice-detail.component';
import {SharedModule} from './common/shared.module';
import {OrderListComponent} from './order/order-list/order-list.component';
import {SideNavComponent} from './order/side-nav/side-nav.component';
import {SendOrdersComponent} from './order/send-orders/send-orders.component';
import {SendOrdersStore} from './service/helper/send-orders.store';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    OrderListComponent,
    InvoiceListComponent,
    InvoiceDetailComponent,
    SideNavComponent,
    SendOrdersComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
  ],
  providers: [
    SendOrdersStore,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
