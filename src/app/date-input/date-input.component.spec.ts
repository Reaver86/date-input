import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { DateInputComponent, DateType } from './date-input.component';

describe('DateInputComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let nativeElement: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [TestHostComponent, DateInputComponent]
    }).createComponent(TestHostComponent);

    component = fixture.componentInstance;
    fixture.detectChanges();
    nativeElement = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set date correctly from outside', () => {
    expect(getInput('day').value).toEqual('');
    expect(getInput('month').value).toEqual('');
    expect(getInput('year').value).toEqual('');

    component.date.setValue('1998-03-12');
    fixture.detectChanges();
    expect(getInput('day').value).toEqual('12');
    expect(getInput('month').value).toEqual('03');
    expect(getInput('year').value).toEqual('1998');
  });

  it('should set disabled for all fields', () => {
    expect(getInput('day').disabled).toEqual(false);
    expect(getInput('month').disabled).toEqual(false);
    expect(getInput('year').disabled).toEqual(false);

    component.date.disable();
    fixture.detectChanges();
    expect(getInput('day').disabled).toEqual(true);
    expect(getInput('month').disabled).toEqual(true);
    expect(getInput('year').disabled).toEqual(true);
  });

  it('should set touched only when all fields are touched', () => {
    expect(component.date.touched).toEqual(false);
    setInputValueAndBlur(getInput('day'), '12');
    expect(component.date.touched).toEqual(false);
    setInputValueAndBlur(getInput('month'), '02');
    expect(component.date.touched).toEqual(false);
    setInputValueAndBlur(getInput('year'), '1990');
    expect(component.date.touched).toEqual(true);
  });

  it('should be able to navigate between inputs with arrow keys', () => {
    setInputValueAndBlur(getInput('day'), '10');
    setKeydownValue(getInput('day'), 'ArrowRight');
    expect(document.activeElement).toEqual(getInput('month'));
    setKeydownValue(getInput('month'), 'ArrowRight');
    expect(document.activeElement).toEqual(getInput('year'));
    setKeydownValue(getInput('year'), 'ArrowLeft');
    expect(document.activeElement).toEqual(getInput('month'));
    setKeydownValue(getInput('month'), 'ArrowLeft');
    expect(document.activeElement).toEqual(getInput('day'));
  });

  it('should delete all characters for day when delete key is pressed', () => {
    setInputValueAndBlur(getInput('day'), '1');
    expect(getInput('day').value).toEqual('1');
    setKeydownValue(getInput('day'), 'Delete');
    expect(getInput('day').value).toEqual('');
  });

  it('should delete all characters for month when backspace key is pressed', () => {
    setInputValueAndBlur(getInput('month'), '2');
    setKeydownValue(getInput('month'), 'Backspace');
    expect(getInput('month').value).toEqual('');
  });

  it('should delete all characters for year when clear key is pressed', () => {
    setInputValueAndBlur(getInput('year'), '1998');
    setKeydownValue(getInput('year'), 'Clear');
    expect(getInput('year').value).toEqual('');
  });

  it('should delete current day value if more than two characters are entered', () => {
    setInputValueAndBlur(getInput('day'), '01');
    setKeydownValue(getInput('month'), 'ArrowLeft');
    expect(getInput('day').value).toEqual('01');
    setInputValueAndBlur(getInput('day'), '2');
    expect(getInput('day').value).toEqual('2');
  });

  it('should delete current month value if more than two characters are entered', () => {
    setInputValueAndBlur(getInput('month'), '01');
    setKeydownValue(getInput('year'), 'ArrowLeft');
    expect(getInput('month').value).toEqual('01');
    setInputValueAndBlur(getInput('month'), '2');
    expect(getInput('month').value).toEqual('2');
  });

  it('should delete current year value if more than four characters are entered', () => {
    setInputValueAndBlur(getInput('year'), '1990');
    expect(getInput('year').value).toEqual('1990');
    setInputValueAndBlur(getInput('year'), '1');
    expect(getInput('year').value).toEqual('1');
  });

  it('should set control value correctly only when all fields are filled out', () => {
    setInputValueAndBlur(getInput('day'), '12');
    expect(component.date.value).toEqual('');
    setInputValueAndBlur(getInput('month'), '03');
    expect(component.date.value).toEqual('');
    setInputValueAndBlur(getInput('year'), '1980');
    expect(component.date.value).toEqual('1980-03-12');
  });

  it('should reset control value when one field is deleted', () => {
    setInputValueAndBlur(getInput('day'), '12');
    setInputValueAndBlur(getInput('month'), '03');
    setInputValueAndBlur(getInput('year'), '1980');
    expect(component.date.value).toEqual('1980-03-12');
    setKeydownValue(getInput('day'), 'Delete');
    expect(component.date.value).toEqual('');
  });

  it('should set placeholder correctly', () => {
    expect(getInput('day').placeholder).toEqual('01');
    expect(getInput('month').placeholder).toEqual('08');
    expect(getInput('year').placeholder).toEqual('1980');

    component.placeholder = '12.11.1950';
    fixture.detectChanges();
    expect(getInput('day').placeholder).toEqual('12');
    expect(getInput('month').placeholder).toEqual('11');
    expect(getInput('year').placeholder).toEqual('1950');
  });

  it('should set min and max Values for year according to type input', () => {
    jasmine.clock().mockDate(new Date(2019));
    fixture.detectChanges();
    expect(getInput('year').min).toEqual('1939');
    expect(getInput('year').max).toEqual('2019');
  });

  function getInput(className: string): HTMLInputElement {
    return nativeElement.querySelector(`input.${className}`) as HTMLInputElement;
  }

  function setInputValueAndBlur(htmlInputElement: HTMLInputElement, value: string) {
    htmlInputElement.value = value;
    htmlInputElement.dispatchEvent(new Event('input'));
    htmlInputElement.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
  }

  function setKeydownValue(htmlInputElement: HTMLInputElement, value: string) {
    const event = new KeyboardEvent('keydown', {
      key: value
    });
    htmlInputElement.dispatchEvent(event);
    fixture.detectChanges();
  }

  @Component({
    template: `
      <app-date-input [formControl]="date" [placeholder]="placeholder" [type]="type"></app-date-input>
    `
  })
  class TestHostComponent {
    date = new FormControl('');
    placeholder = '01.08.1980';
    type = DateType.Birthday;
  }
});
