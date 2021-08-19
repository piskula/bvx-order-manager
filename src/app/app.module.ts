import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { InvoiceListComponent } from './order/invoice-list/invoice-list.component';
import {AboutComponent} from './about/about.component';
import {AppRoutingModule} from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ConfirmSendingDialogComponent, InvoiceDetailComponent} from './order/invoice-detail/invoice-detail.component';
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
    ConfirmSendingDialogComponent,
    SideNavComponent,
    SendOrdersComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    FormsModule,
  ],
  providers: [
    SendOrdersStore,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
