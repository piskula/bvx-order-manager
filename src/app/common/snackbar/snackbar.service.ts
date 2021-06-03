import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SheetSnackbarComponent} from './sheet-snackbar/sheet.snackbar';

@Injectable()
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) {
  }

  showSuccessSheetIdMessage(sheetId: string): void {
    this.snackBar.openFromComponent(
      SheetSnackbarComponent,
      {
        data: {sheetId},
        panelClass: ['color-bg-green'],
        duration: 5000,
      },
    );
  }

  showErrorMessage(title: string, extraInfo: string = null): void {
    if (!!extraInfo) {
      console.error(extraInfo);
    }
    this.snackBar.open(
      title,
      'Dismiss',
      {
        panelClass: ['color-bg-red'],
        duration: 3500,
      },
    );
  }

  showSimpleSuccess(title: string): void {
    this.snackBar.open(
      title,
      'Dismiss',
      {
        panelClass: ['color-bg-green'],
        duration: 5000,
      },
    );
  }

}
