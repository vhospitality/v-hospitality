import { Highlightable } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostBinding,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { SelectService } from '../select.service';

@Component({
  selector: 'app-select-option',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './select-option.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./select-option.component.scss'],
})
export class SelectOptionComponent implements Highlightable {
  @Input() value!: any;

  @HostBinding('class.active') active = false;

  @HostBinding('class.selected')
  public get selected(): boolean {
    return this.selectService.getParent().selectedOption === this;
  }

  // @HostListener('click', ['$event']) onSelect(event: UIEvent) {
  //   event.preventDefault();
  //   event.stopPropagation();
  //   this.selectService.getParent().onSelect(this);
  // }

  constructor(
    private elementRef: ElementRef,
    private selectService: SelectService
  ) {}

  setActiveStyles(): void {
    this.focus();
    this.active = true;
  }

  setInactiveStyles(): void {
    this.active = false;
  }

  getLabel(): string {
    return this.value;
  }

  focus(options?: FocusOptions) {
    this.elementRef.nativeElement.focus(options);
  }

  addOrMinus(type: string, id: number) {
    this.selectService.sendSelectClickEvent(type, id);
    this.selectService.getParent().onSelect(this);
  }
}
