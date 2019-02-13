import { Component, ElementRef, ViewChild, Input, Renderer2, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export enum DateType {
  Birthday = "BIRTHDAY",
  Default = "DEFAULT"
}

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DateInputComponent,
      multi: true
    }
  ]
})
export class DateInputComponent implements ControlValueAccessor, OnInit {
  @Input() placeholder = '21.01.1990';
  @Input() type = DateType.Default;

  onChange: (string) => void;
  onTouched: () => void;
  disabled: boolean;

  private dayTouched = false;
  private monthTouched = false;
  private yearTouched = false;

  private readonly ASCII_0 = 48;
  private readonly ASCII_9 = 57;
  private readonly KEYCODE_PUNKT = 190;
  private readonly KEYCODE_PASTE = 118;

  private readonly DAY_MIN = '1';
  private readonly DAY_MAX = '31';
  private readonly MONTH_MIN = '1';
  private readonly MONTH_MAX = '12';
  private YEAR_MIN;
  private YEAR_MAX;

  @ViewChild('day') dayInputRef: ElementRef;
  @ViewChild('month') monthInputRef: ElementRef;
  @ViewChild('year') yearInputRef: ElementRef;

  constructor(private renderer: Renderer2) {
  }

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    switch (this.type) {
      case DateType.Birthday:
        this.YEAR_MIN = (currentYear - 80).toString();
        this.YEAR_MAX = currentYear.toString();
        break;
      case DateType.Default:
      default:
        this.YEAR_MIN = 1900;
        this.YEAR_MAX = 2100;
        break;
    }
  }

  writeValue(value: string): void {
    const date = new Date(value);

    if (this.isValidDate(date)) {
      this.dayValue = this.formatWithLeadingZero(date.getDate());
      this.monthValue = this.formatWithLeadingZero(date.getMonth() + 1);
      this.yearValue = date.getFullYear().toString();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onKeypress(event: KeyboardEvent): boolean {
    return this.isNumberKey(event.keyCode) || this.isPasteKey(event.keyCode);
  }

  onKeydownDay(event: KeyboardEvent): boolean {
    if (this.isNumberKey(event.keyCode)) {
      if (this.dayValue.length === 0) {
        if (Number(event.key) > 3) {
          this.dayValue = '0' + event.key;
          event.preventDefault();
          this.monthNode.focus();
        }
      } else if (this.dayValue.length === 1 && this.monthNode) {
        this.dayValue += event.key;
        event.preventDefault();
        this.monthNode.focus();
      } else if (this.dayValue.length === 2) {
        event.preventDefault();
        if (Number(event.key) > 3) {
          this.dayValue = '0' + event.key;
          this.monthNode.focus();
        } else {
          this.dayValue = event.key;
        }
      }
    }

    if ((this.isRightKey(event.key) || this.isDotKey(event.keyCode)) && this.monthNode) {
      this.monthNode.focus();
    }
    if (this.isDeleteKey(event.key)) {
      this.dayValue = '';
    }

    this.setOuterValue();
    return true;
  }

  onKeydownMonth(event: KeyboardEvent): boolean {
    if (this.isNumberKey(event.keyCode)) {
      if (this.monthValue.length === 0) {
        if (Number(event.key) > 1) {
          this.monthValue = '0' + event.key;
          event.preventDefault();
          this.yearNode.focus();
        }
      } else if (this.monthValue.length === 1 && this.yearNode) {
        event.preventDefault();
        this.monthValue += event.key;
        this.yearNode.focus();
      } else if (this.monthValue.length === 2) {
        event.preventDefault();
        if (Number(event.key) > 1) {
          this.monthValue = '0' + event.key;
          this.yearNode.focus();
        } else {
          this.monthValue = event.key;
        }
      }
    }

    if (this.isLeftKey(event.key) && this.dayNode) {
      this.dayNode.focus();
    }
    if ((this.isRightKey(event.key) || this.isDotKey(event.keyCode)) && this.yearNode) {
      this.yearNode.focus();
    }
    if (this.isDeleteKey(event.key)) {
      this.monthValue = '';
    }

    this.setOuterValue();
    return true;
  }

  onKeydownYear(event: KeyboardEvent): boolean {
    if (this.isNumberKey(event.keyCode)) {

      if (this.type === DateType.Birthday) {
        if (this.yearValue.length === 1) {
          const currentValue = Number(this.yearValue + event.key);
          const currentYear = this.YEAR_MAX.slice(-2);
          if (currentValue === 19 || currentValue === 20) {
            return true;
          } else if (currentValue > currentYear) {
            this.yearValue = '19' + currentValue.toString();
            this.setOuterValue();
            return false;
          } else if (currentValue <= currentYear) {
            this.yearValue = '20' + currentValue.toString();
            this.setOuterValue();
            return false;
          }
        }
      }

      if (this.yearValue.length === 4) {
        event.preventDefault();
        this.yearValue = event.key;
      }
    }

    if (this.isLeftKey(event.key) && this.monthNode) {
      this.monthNode.focus();
    }
    if (this.isDeleteKey(event.key)) {
      this.yearValue = '';
    }

    this.setOuterValue();
    return true;
  }

  onLoseFocusDay(event: FocusEvent) {
    const input = event.target as HTMLInputElement;
    if (input.value.length === 1) {
      this.addLeadingZeroToDay();
    }
    if (input.valueAsNumber < Number(this.DAY_MIN)) {
      this.dayValue = this.DAY_MIN;
    }
    if (input.valueAsNumber > Number(this.DAY_MAX)) {
      this.dayValue = this.DAY_MAX;
    }
  }

  onLoseFocusMonth(event: FocusEvent) {
    const input = event.target as HTMLInputElement;
    if (input.value.length === 1) {
      this.addLeadingZeroToMonth();
    }
    if (input.valueAsNumber < Number(this.MONTH_MIN)) {
      this.monthValue = this.MONTH_MIN;
    }
    if (input.valueAsNumber > Number(this.MONTH_MAX)) {
      this.monthValue = this.MONTH_MAX;
    }
  }

  onLoseFocusYear(event: FocusEvent) {
    const input = event.target as HTMLInputElement;
    if (input.valueAsNumber < Number(this.YEAR_MIN)) {
      this.yearValue = this.YEAR_MIN;
    }
    if (input.valueAsNumber > Number(this.YEAR_MAX)) {
      this.yearValue = this.YEAR_MAX;
    }
  }

  onTouchedDay(): void {
    this.dayTouched = true;
    if (this.allTouched()) {
      this.onTouched();
    }
  }

  onTouchedMonth(): void {
    this.monthTouched = true;
    if (this.allTouched()) {
      this.onTouched();
    }
  }

  onTouchedYear(): void {
    this.yearTouched = true;
    if (this.allTouched()) {
      this.onTouched();
    }
  }

  onPaste(event: ClipboardEvent): boolean {
    event.preventDefault();
    event.stopPropagation();

    const value = event.clipboardData.getData('text/plain');
    const matches = this.matchGermanDate(value);
    if (matches) {
      this.dayValue = matches[0];
      this.monthValue = matches[1];
      this.yearValue = matches[2];
      this.setOuterValue();
    }
    return false;
  }

  private addLeadingZeroToDay() {
    this.dayValue = '0' + this.dayValue;
  }

  private addLeadingZeroToMonth() {
    this.monthValue = '0' + this.monthValue;
  }

  private matchGermanDate(value: string): string[] {
    const matches = value.match(/(\d{1,2})[.-/]?(\d{1,2})[.-/](\d{2,4})/);
    if (matches) {
      matches.shift(); // remove the whole match
    }
    return matches;
  }

  private allTouched(): boolean {
    return this.dayTouched && this.monthTouched && this.yearTouched;
  }

  private isValidDate(date: any): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }

  private formatWithLeadingZero(number: number): string {
    return number < 10 ? '0' + number : '' + number;
  }

  private get dayNode(): HTMLInputElement {
    return this.dayInputRef.nativeElement;
  }

  private get dayValue(): string {
    return this.dayNode.value;
  }

  private set dayValue(value: string) {
    this.renderer.setProperty(this.dayInputRef.nativeElement, 'value', value);
  }

  private get monthNode(): HTMLInputElement {
    return this.monthInputRef.nativeElement;
  }

  private get monthValue(): string {
    return this.monthNode.value;
  }

  private set monthValue(value: string) {
    this.renderer.setProperty(this.monthInputRef.nativeElement, 'value', value);
  }

  private get yearNode(): HTMLInputElement {
    return this.yearInputRef.nativeElement;
  }

  private get yearValue(): string {
    return this.yearNode.value;
  }

  private set yearValue(value: string) {
    this.renderer.setProperty(this.yearInputRef.nativeElement, 'value', value);
  }

  private setOuterValue(): void {
    if (this.dayValue && this.monthValue && this.yearValue) {
      this.onChange(this.yearValue + '-' + this.monthValue + '-' + this.dayValue);
    } else {
      this.onChange('');
    }
  }

  private isNumberKey(keyCode: number): boolean {
    return keyCode >= this.ASCII_0 && keyCode <= this.ASCII_9;
  }

  private isPasteKey(keyCode: number): boolean {
    return keyCode === this.KEYCODE_PASTE;
  }

  private isDeleteKey(key: string): boolean {
    return key === 'Backspace' || key === 'Delete' || key === 'Clear';
  }

  private isLeftKey(key: string): boolean {
    return key === 'ArrowLeft' || key === 'Left';
  }

  private isRightKey(key: string): boolean {
    return key === 'ArrowRight' || key === 'Right';
  }

  private isDotKey(charCode: number): boolean {
    return charCode === this.KEYCODE_PUNKT;
  }
}
