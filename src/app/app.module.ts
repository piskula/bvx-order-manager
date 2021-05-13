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

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    OrderListComponent,
    InvoiceListComponent,
    InvoiceDetailComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
