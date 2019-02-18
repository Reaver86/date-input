import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgxDateType } from 'ngx-date-input';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  date = new FormControl('');
  dateType = NgxDateType.Birthday;
}
