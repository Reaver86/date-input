import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NgxDateInputModule } from '../../projects/ngx-date-input/src/lib/ngx-date-input.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, ReactiveFormsModule, NgxDateInputModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
