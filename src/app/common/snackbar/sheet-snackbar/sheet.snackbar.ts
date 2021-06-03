import {Component, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';

@Component({
  selector: 'app-sheet-snackbar',
  templateUrl: './sheet.snackbar.html',
  styleUrls: ['./sheet.snackbar.scss'],
})
export class SheetSnackbarComponent {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
  }

}
