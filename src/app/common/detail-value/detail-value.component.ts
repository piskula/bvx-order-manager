import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-detail-value',
  templateUrl: './detail-value.component.html',
  styleUrls: ['./detail-value.component.scss'],
})
export class DetailValueComponent implements OnInit {

  @Input()
  title = 'missing_title';

  ngOnInit(): void {
  }

}
