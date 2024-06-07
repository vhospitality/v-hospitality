import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Subscription } from 'rxjs';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';
import { CardDetails } from '../../../model/form';

@Component({
  selector: 'app-account-payment-form',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSelectModule,
  ],
  templateUrl: './account-payment-form.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./account-payment-form.component.scss'],
})
export class AccountPaymentFormComponent {
  @Input() userData: any;
  clickEventSubscription?: Subscription;
  @ViewChild('fform') feedbackFormDirective: any;
  feedbackForm: any = FormGroup;
  feedback!: CardDetails;
  loading: boolean = false;
  disabled: boolean = false;
  countries: any[] = [
    { name: 'Nigeria', code: '', id: 8 },
    { name: 'United States', code: '', id: 1 },
    { name: 'Canada', code: '', id: 2 },
    { name: 'United Kingdom', code: '', id: 3 },
    { name: 'Australia', code: '', id: 4 },
    { name: 'New Zealand', code: '', id: 5 },
    { name: 'India', code: '', id: 6 },
    { name: 'Brazil', code: '', id: 7 },
    { name: 'Afghanistan', code: '', id: 9 },
    { name: 'Albania', code: '', id: 10 },
    { name: 'Algeria', code: '', id: 11 },
  ];

  formErrors: any = {
    cardNumber: '',
    monthYear: '',
    cvv: '',
    address: '',
    email: '',
    name: '',
    city: '',
    country: '',
    zip: '',
  };

  validationMessages: any = {
    cardNumber: {
      required: 'required.',
      minlength: '16 digits required.',
      maxlength: '16 digits required.',
      pattern: 'invalid card number.',
      validateCCNumber: 'invalid card number',
    },
    monthYear: {
      required: 'required.',
      pattern: 'invalid format.',
    },
    cvv: {
      required: 'required.',
      pattern: 'invalid cvv.',
    },
    // agree: {
    //   required: 'required.',
    // },
    email: {
      required: 'required.',
      email: 'not a valid e-mail.',
    },
    address: {
      required: 'required',
    },
    name: {
      required: 'required',
    },
    city: {
      required: 'required',
    },
    country: {
      required: 'required',
    },
    zip: {
      required: 'required',
    },
  };

  constructor(private fb: FormBuilder, private service: ToggleNavService) {
    this.createForm();
    this.clickEventSubscription = this.service
      .getPaymentFormClickEvent()
      .subscribe((data: any) => {
        if (data?.actionType === 'submit') {
          this.onSubmit();
        }
      });
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      cardNumber: [
        '',
        [
          Validators.required,
          Validators.pattern,
          Validators.minLength(19),
          Validators.maxLength(19),
        ],
      ],
      monthYear: ['', [Validators.required, Validators.pattern]],
      cvv: ['', [Validators.required, Validators.pattern]],
      emails: this.fb.array([this.addEmailFormGroup()]),
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
      zip: ['', [Validators.required]],
    });

    this.feedbackForm.valueChanges.subscribe((data: any) =>
      this.onValueChanged(data)
    );
    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) {
      return;
    }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] = messages[key];
            }
          }
        }
      }
    }
  }

  addEmailFormGroup(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.email]],
    });
  }

  addEmailButtonClick(): void {
    (<FormArray>this.feedbackForm.get('emails')).push(this.addEmailFormGroup());
  }

  removeEmailButtonClick(emailGroupIndex: number): void {
    const emailFormArray = <FormArray>this.feedbackForm.get('emails');
    emailFormArray.removeAt(emailGroupIndex);
    emailFormArray.markAsDirty();
    emailFormArray.markAsTouched();
  }

  onSubmit() {
    this.feedback = this.feedbackForm.value;
    this.onValueChanged();
    const feed = this.feedbackFormDirective.invalid;
    if (feed) {
      this.service.sendPaymentFormClickEvent({
        type: 'add',
        actionType: 'error',
      });
    } else {
      this.loading = true;
      this.disabled = true;

      setTimeout(() => {
        this.loading = false;
        this.disabled = false;

        this.service.sendToastClickEvent({
          success: true,
          message: 'Card Successfully saved',
        });

        this.service.sendPaymentFormClickEvent({
          type: 'save',
          actionType: 'submited',
        });
      }, 2000);
    }
  }

  ngOnInit(): void {
    // credit card
    let ccNumberInput = document.querySelector('.cc-number-input'),
      ccNumberPattern = /^\d{0,16}$/g,
      ccNumberSeparator = ' ',
      ccNumberInputOldValue: any,
      ccNumberInputOldCursor: any,
      ccExpiryInput = document.querySelector('.cc-expiry-input'),
      ccExpiryPattern = /^\d{0,4}$/g,
      ccExpirySeparator = '/',
      ccExpiryInputOldValue: any,
      ccExpiryInputOldCursor,
      ccCVCInput = document.querySelector('.cc-cvc-input'),
      ccCVCPattern = /^\d{0,3}$/g,
      mask = (value: any, limit: number, separator: string) => {
        var output = [];
        for (let i = 0; i < value?.length; i++) {
          if (i !== 0 && i % limit === 0) {
            output.push(separator);
          }

          output.push(value[i]);
        }

        return output.join('');
      },
      unmask = (value: any) => value.replace(/[^\d]/g, ''),
      checkSeparator = (position: any, interval: number) =>
        Math.floor(position / (interval + 1)),
      ccNumberInputKeyDownHandler = (e: any) => {
        let el = e?.target;
        ccNumberInputOldValue = el?.value;
        ccNumberInputOldCursor = el?.selectionEnd;
      },
      ccNumberInputInputHandler = (e: any) => {
        let el = e?.target,
          newValue = unmask(el?.value),
          newCursorPosition;

        if (newValue.match(ccNumberPattern)) {
          newValue = mask(newValue, 4, ccNumberSeparator);

          newCursorPosition =
            ccNumberInputOldCursor -
            checkSeparator(ccNumberInputOldCursor, 4) +
            checkSeparator(
              ccNumberInputOldCursor +
                (newValue.length - ccNumberInputOldValue.length),
              4
            ) +
            (unmask(newValue).length - unmask(ccNumberInputOldValue).length);

          el.value = newValue !== '' ? newValue : '';
        } else {
          el.value = ccNumberInputOldValue;
          newCursorPosition = ccNumberInputOldCursor;
        }

        el.setSelectionRange(newCursorPosition, newCursorPosition);

        highlightCC(el.value);
      },
      highlightCC = (ccValue: any) => {
        let ccCardType = '',
          ccCardTypePatterns: any = {
            amex: /^3/,
            visa: /^4/,
            mastercard: /^5/,
            disc: /^6/,

            genric: /(^1|^2|^7|^8|^9|^0)/,
          };

        for (const cardType in ccCardTypePatterns) {
          if (ccCardTypePatterns[cardType].test(ccValue)) {
            ccCardType = cardType;
            break;
          }
        }

        // let activeCC = document.querySelector('.cc-types__img--active'),
        //   newActiveCC = document.querySelector(`.cc-types__img--${ccCardType}`);

        // if (activeCC) {
        //   activeCC.classList.remove('cc-types__img--active');
        // }

        // if (newActiveCC) {
        //   newActiveCC.classList.add('cc-types__img--active');
        // }
      },
      ccExpiryInputKeyDownHandler = (e: any) => {
        let el = e?.target;
        ccExpiryInputOldValue = el?.value;
        ccExpiryInputOldCursor = el?.selectionEnd;
      },
      ccExpiryInputInputHandler = (e: any) => {
        let el = e?.target,
          newValue = el?.value;

        newValue = unmask(newValue);
        if (newValue.match(ccExpiryPattern)) {
          newValue = mask(newValue, 2, ccExpirySeparator);
          el.value = newValue;
        } else {
          el.value = ccExpiryInputOldValue;
        }
      };

    if (ccNumberInput) {
      ccNumberInput.addEventListener('keydown', ccNumberInputKeyDownHandler);
      ccNumberInput.addEventListener('input', ccNumberInputInputHandler);
    }

    if (ccExpiryInput) {
      ccExpiryInput.addEventListener('keydown', ccExpiryInputKeyDownHandler);
      ccExpiryInput.addEventListener('input', ccExpiryInputInputHandler);
    }
  }
}
