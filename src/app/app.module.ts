import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { DateInputComponent } from './date-input/date-input.component';

@NgModule({
  declarations: [AppComponent, DateInputComponent],
  imports: [BrowserModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
  exports: [DateInputComponent]
})
export class AppModule {}
