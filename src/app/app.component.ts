import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DateType } from './date-input/date-input.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  date = new FormControl('');
  dateType = DateType.Birthday;
}
