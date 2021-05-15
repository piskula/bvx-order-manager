import { NgModule } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTableModule} from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTreeModule} from '@angular/material/tree';
import {MatBadgeModule} from '@angular/material/badge';
import {MatStepperModule} from '@angular/material/stepper';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

const modules = [
  MatSidenavModule,
  MatButtonModule,
  MatToolbarModule,
  MatTableModule,
  MatCardModule,
  MatChipsModule,
  MatTooltipModule,
  MatProgressBarModule,
  MatFormFieldModule,
  MatIconModule,
  MatCheckboxModule,
  MatTreeModule,
  MatBadgeModule,
  MatStepperModule,
  MatProgressSpinnerModule,
];

@NgModule({
  imports: [
    modules
  ],
  providers: [],
  exports: [
    modules
  ]
})
export class MaterialModule { }
