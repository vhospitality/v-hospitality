import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';
@Directive({
  selector: '[appInputRestriction]',
  standalone: true,
})
export class InputRestrictionDirective {
  inputElement: ElementRef;

  @Input('appInputRestriction') appInputRestriction: any;
  arabicRegex = '[\u0600-\u06FF]';

  constructor(el: ElementRef) {
    this.inputElement = el;
  }

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    if (this.appInputRestriction === 'integer' && event.key === '.') {
      event.preventDefault(); // Prevent typing dot in integer mode
    } else if (
      this.appInputRestriction === 'noSpecialChars' &&
      event.key === '.'
    ) {
      event.preventDefault(); // Prevent typing dot in noSpecialChars mode
    }
  }

  @HostListener('keypress', ['$event']) onKeyPress(event: any) {
    if (this.appInputRestriction === 'integer') {
      this.integerOnly(event);
    } else if (this.appInputRestriction === 'noSpecialChars') {
      this.noSpecialChars(event);
    }
  }

  integerOnly(event: any) {
    const e = <KeyboardEvent>event;
    if (e.key === 'Tab' || e.key === 'TAB') {
      return;
    }
    if (
      [46, 8, 9, 27, 13, 110].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A
      (e.keyCode === 65 && e.ctrlKey === true) ||
      // Allow: Ctrl+C
      (e.keyCode === 67 && e.ctrlKey === true) ||
      // Allow: Ctrl+V
      (e.keyCode === 86 && e.ctrlKey === true) ||
      // Allow: Ctrl+X
      (e.keyCode === 88 && e.ctrlKey === true)
    ) {
      // let it happen, don't do anything
      return;
    }
    if (
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].indexOf(e.key) === -1
    ) {
      e.preventDefault();
    }
  }

  noSpecialChars(event: any) {
    const e = <KeyboardEvent>event;
    if (e.key === 'Tab' || e.key === 'TAB') {
      return;
    }
    let k;
    k = event.keyCode; // k = event.charCode;  (Both can be used)
    if (
      (k > 64 && k < 91) ||
      (k > 96 && k < 123) ||
      k === 8 ||
      k === 32 ||
      (k >= 48 && k <= 57)
    ) {
      return;
    }
    const ch = String.fromCharCode(e.keyCode);
    const regEx = new RegExp(this.arabicRegex);
    if (regEx.test(ch)) {
      return;
    }
    e.preventDefault();
  }

  @HostListener('paste', ['$event']) onPaste(event: any) {
    let regex: any;
    if (this.appInputRestriction === 'integer') {
      regex = /[0-9]/g;
    } else if (this.appInputRestriction === 'noSpecialChars') {
      regex = /[a-zA-Z0-9\u0600-\u06FF]/g;
    }
    const e: any = <ClipboardEvent>event;
    const pasteData = e.clipboardData.getData('text/plain');
    let m;
    let matches = 0;
    while ((m = regex.exec(pasteData)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      // The result can be accessed through the `m`-variable.
      m.forEach((match: any, groupIndex: number) => {
        matches++;
      });
    }
    if (matches === pasteData.length) {
      return;
    } else {
      e.preventDefault();
    }
  }
}
