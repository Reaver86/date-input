import { Component, ElementRef, ViewChild, Renderer2, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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
export class DateInputComponent implements ControlValueAccessor {
  @Input() placeholder = '21.01.1990';

  onChange: (string) => void;
  onTouched: () => void;
  disabled: boolean;

  private dayTouched = false;
  private monthTouched = false;
  private yearTouched = false;

  private readonly ASCII_0 = 48;
  private readonly ASCII_9 = 57;
  private readonly ASCII_PUNKT = 46;
  private readonly KEYCODE_PASTE = 118;

  @ViewChild('day') dayInputRef: ElementRef;
  @ViewChild('month') monthInputRef: ElementRef;
  @ViewChild('year') yearInputRef: ElementRef;

  constructor(private renderer: Renderer2) {}

  writeValue(value: string): void {
    const date: Date = new Date(value);

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

  onKeypressDay(event: KeyboardEvent): boolean {
    if (this.isDotKey(event.charCode) && this.monthNode) {
      this.addLeadingZeroToDay();
      this.monthNode.focus();
      return false;
    }

    return this.onKeypress(event);
  }

  onKeypressMonth(event: KeyboardEvent): boolean {
    if (this.isDotKey(event.charCode) && this.yearNode) {
      this.addLeadingZeroToMonth();
      this.yearNode.focus();
      return false;
    }

    return this.onKeypress(event);
  }

  onKeypressYear(event: KeyboardEvent): boolean {
    return this.onKeypress(event);
  }

  onKeypress(event: KeyboardEvent): boolean {
    if (this.isNumberKey(event.keyCode) || this.isPasteKey(event.keyCode) || this.isNavigationKey(event.key)) {
      return true;
    }
    return false;
  }

  onKeydownDay(event: KeyboardEvent): boolean {
    if (this.isNumberKey(event.keyCode)) {
      if (this.dayValue.length === 1 && this.monthNode) {
        event.preventDefault();
        this.dayValue += event.key;
        this.monthNode.focus();
        return false;
      } else if (this.dayValue.length === 2) {
        event.preventDefault();
        this.dayValue = event.key;
      }
    }

    if (this.isRightKey(event.key) && this.monthNode) {
      this.addLeadingZeroToDay();
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
      if (this.monthValue.length === 1 && this.yearNode) {
        event.preventDefault();
        this.monthValue += event.key;
        this.yearNode.focus();
      } else if (this.monthValue.length === 2) {
        event.preventDefault();
        this.monthValue = event.key;
      }
    }

    if (this.isLeftKey(event.key) && this.dayNode) {
      this.addLeadingZeroToMonth();
      this.dayNode.focus();
    }
    if (this.isRightKey(event.key) && this.yearNode) {
      this.addLeadingZeroToMonth();
      this.yearNode.focus();
    }
    if (this.isDeleteKey(event.key)) {
      this.monthValue = '';
    }

    this.setOuterValue();
    return true;
  }

  onKeydownYear(event: KeyboardEvent): boolean {
    if (this.isNumberKey(event.keyCode) && this.yearValue.length === 4) {
      event.preventDefault();
      this.yearValue = event.key;
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
    if (this.dayValue.length === 1) {
      this.dayValue = '0' + this.dayValue;
    }
  }

  private addLeadingZeroToMonth() {
    if (this.monthValue.length === 1) {
      this.monthValue = '0' + this.monthValue;
    }
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

  private isNavigationKey(key: string): boolean {
    return this.isDeleteKey(key) || this.isArrowKey(key);
  }

  private isArrowKey(key: string): boolean {
    return this.isLeftKey(key) || this.isRightKey(key) || this.isUpKey(key) || this.isDownKey(key);
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

  private isUpKey(key: string): boolean {
    return key === 'ArrowUp' || key === 'Up';
  }

  private isDownKey(key: string): boolean {
    return key === 'ArrowDown' || key === 'Down';
  }

  private isDotKey(charCode: number): boolean {
    return charCode === this.ASCII_PUNKT;
  }
}
