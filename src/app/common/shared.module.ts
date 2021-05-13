import { NgModule } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTableModule} from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {DetailValueComponent} from './detail-value/detail-value.component';
import {MaterialModule} from './material.module';
import {MoneyPipe} from './pipe/money.pipe';

const modules = [
  MaterialModule,
];
const declarations = [
  MoneyPipe,
  DetailValueComponent,
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
