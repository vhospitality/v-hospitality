import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import {
  DOWN_ARROW,
  ENTER,
  LEFT_ARROW,
  RIGHT_ARROW,
  SPACE,
  UP_ARROW,
  hasModifierKey,
} from '@angular/cdk/keycodes';
import { CdkConnectedOverlay, OverlayModule } from '@angular/cdk/overlay';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  HostBinding,
  HostListener,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { selectReveal } from './animations';
import { SelectOptionComponent } from './select-option/select-option.component';
import { SelectService } from './select.service';

const SELECT_PANEL_HEIGHT = 256;

const SELECT_PANEL_PADDING = 5;

const SELECT_OPTION_HEIGHT = 39;

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, OverlayModule, SelectOptionComponent],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  animations: [selectReveal],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent implements OnInit, OnDestroy {
  triggerRect: ClientRect | any;

  keyManager!: ActiveDescendantKeyManager<SelectOptionComponent>;

  @HostBinding('attr.tabIndex') tabIndex = 0;

  @HostBinding('attr.role') role = 'combobox';

  @HostBinding('attr.aria-autocomplete') autocomplete = 'none';

  @ContentChildren(SelectOptionComponent, { descendants: true })
  private selectOptions!: QueryList<SelectOptionComponent>;

  @ViewChild('trigger')
  private trigger!: ElementRef;

  @ViewChild(CdkConnectedOverlay, { static: true })
  private connectedOverlay!: CdkConnectedOverlay;

  @ViewChild('panel')
  private panel!: ElementRef;

  @HostListener('keydown', ['$event'])
  onKeyDown(event: any) {
    this.panelOpen
      ? this.handleOpenKeyDown(event)
      : this.handleClosedKeyDown(event);
  }

  @HostListener('focus') onFocus() {
    if (!this.disabled) {
      this._focused = true;
    }
  }

  @HostListener('blur') onBlur() {
    this._focused = false;
    if (!this.disabled && !this.panelOpen) {
      this.changeDetectorRef.markForCheck();
    }
  }

  private _displayOption: SelectedOption | any;
  displayOption2: any;

  private _selectedOption: SelectOptionComponent | any;

  private _panelOpen: boolean = false;

  private _focused: boolean = false;

  private _disabled: boolean = false;

  private readonly destroy$ = new Subject<void>();

  get panelOpen(): boolean {
    return this._panelOpen;
  }

  get focused(): boolean {
    return this._focused;
  }

  get disabled(): boolean {
    return this._disabled;
  }

  get displayOption(): SelectedOption {
    return this._displayOption;
  }

  get selectedOption(): SelectOptionComponent {
    return this._selectedOption;
  }

  get empty(): boolean {
    return !this._selectedOption;
  }

  clickEventSubscription?: Subscription;

  constructor(
    private elementRef: ElementRef,
    private changeDetectorRef: ChangeDetectorRef,
    private viewportRuler: ViewportRuler,
    private selectService: SelectService
  ) {
    this.selectService.init(this);
    this.displayOption2 = this.selectService.getSelectMessage();

    this.clickEventSubscription = this.selectService
      .getSelectClickEvent()
      .subscribe(() => {
        this.displayOption2 = this.selectService.getSelectMessage();
      });
  }

  ngOnInit(): void {
    this.viewportRuler
      .change()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.panelOpen) {
          this.triggerRect = this.trigger.nativeElement.getBoundingClientRect();
          this.changeDetectorRef.markForCheck();
        }
      });
  }

  ngAfterContentInit() {
    this.initKeyManager();
  }

  onAttach() {
    this.connectedOverlay.positionChange.pipe(take(1)).subscribe(() => {
      this.changeDetectorRef.detectChanges();
      this.highlightOption();

      if (this.panelOpen && this.panel) {
        this.scrollPosition(this.keyManager.activeItemIndex || 0);
      }
    });
  }

  onSelect(option: SelectOptionComponent) {
    this.keyManager.setActiveItem(option);
    this._selectedOption = option;
    this._displayOption = { value: option.value };
    // this.close();
    this.focus();
    this.changeDetectorRef.markForCheck();
  }

  open() {
    this.updateRect();
    this.highlightOption();
    this.keyManager.withHorizontalOrientation(null);

    this._panelOpen = !this._panelOpen;
  }

  close() {
    if (this.panelOpen) {
      this._panelOpen = false;
      this.changeDetectorRef.markForCheck();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initKeyManager() {
    this.keyManager = new ActiveDescendantKeyManager<SelectOptionComponent>(
      this.selectOptions
    )
      .withTypeAhead()
      .withVerticalOrientation()
      .withHorizontalOrientation('ltr')
      .withHomeAndEnd()
      .withAllowedModifierKeys(['shiftKey']);

    this.keyManager.tabOut.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.focus();
      this.close();
    });
  }

  private handleClosedKeyDown(event: any) {
    const keyCode = event.keyCode;
    const isArrowKey =
      keyCode === DOWN_ARROW ||
      keyCode === UP_ARROW ||
      keyCode === LEFT_ARROW ||
      keyCode === RIGHT_ARROW;
    const isOpenKey = keyCode === ENTER || keyCode === SPACE;
    const manager = this.keyManager;

    if (
      (!manager.isTyping() && isOpenKey && !hasModifierKey(event)) ||
      (event.altKey && isArrowKey)
    ) {
      event.preventDefault();
      this._panelOpen = true;
    } else {
      manager.onKeydown(event);
    }
  }

  private handleOpenKeyDown(event: any) {
    const manager = this.keyManager;
    const keyCode = event.keyCode;
    const isArrowKey = keyCode === DOWN_ARROW || keyCode === UP_ARROW;
    const isTyping = manager.isTyping();

    if (isArrowKey && event.altKey) {
      // Close the select on ALT + arrow key to match the native <select>
      event.preventDefault();
      this.close();
    } else if (
      !isTyping &&
      (keyCode === ENTER || keyCode === SPACE) &&
      manager.activeItem &&
      !hasModifierKey(event)
    ) {
      event.preventDefault();
      this.onSelect(manager.activeItem);
    } else {
      manager.onKeydown(event);
      if (this.panelOpen && this.panel) {
        this.scrollPosition(this.keyManager.activeItemIndex || 0);
      }
    }

    this.changeDetectorRef.markForCheck();
  }

  private focus(options?: FocusOptions) {
    this.elementRef.nativeElement.focus(options);
  }

  private highlightOption(): void {
    if (this.keyManager) {
      if (this.empty) {
        this.keyManager.setFirstItemActive();
      } else {
        this.keyManager.setActiveItem(this._selectedOption);
      }
    }
  }

  private scrollPosition(index: number) {
    if (index === 0) {
      this.panel.nativeElement.scrollTop = 0;
    } else {
      this.panel.nativeElement.scrollTop =
        SELECT_OPTION_HEIGHT * index +
        (SELECT_OPTION_HEIGHT - SELECT_PANEL_PADDING) -
        Math.ceil(SELECT_PANEL_HEIGHT / 2);
    }
  }

  private updateRect() {
    this.triggerRect = this.trigger.nativeElement.getBoundingClientRect();
  }
}

export interface SelectedOption {
  value: string;
}
