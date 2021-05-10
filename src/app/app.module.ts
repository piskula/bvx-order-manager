import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { OrderListComponent } from './order/order-list/order-list.component';
import {AboutComponent} from './about/about.component';
import {AppRoutingModule} from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MaterialModule} from './common/material.module';
import {HttpClientModule} from '@angular/common/http';
import { OrderDetailComponent } from './order/order-detail/order-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    OrderListComponent,
    OrderDetailComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
