import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgxDateType } from '../../projects/ngx-date-input/src/lib/ngx-date-input.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  date = new FormControl('');
  dateType = NgxDateType.Birthday;
}
