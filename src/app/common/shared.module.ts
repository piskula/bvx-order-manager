import { NgModule } from '@angular/core';
import {DetailValueComponent} from './detail-value/detail-value.component';
import {MaterialModule} from './material.module';
import {MoneyPipe} from './pipe/money.pipe';
import {SheetSnackbarComponent} from './snackbar/sheet.snackbar';

const modules = [
  MaterialModule,
];
const declarations = [
  MoneyPipe,
  DetailValueComponent,
  SheetSnackbarComponent,
];

@NgModule({
  declarations: [
    declarations,
  ],
  imports: [
    modules,
  ],
  providers: [],
  exports: [
    modules,
    declarations,
  ]
})
export class SharedModule { }
