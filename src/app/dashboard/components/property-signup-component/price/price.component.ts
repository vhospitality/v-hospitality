import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { baseUrl } from '../../../../../environments/environment';
import { AuthService } from '../../../../global-services/auth.service';
import { HttpService } from '../../../../global-services/http.service';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';

@Component({
  selector: 'app-price',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './price.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./price.component.scss'],
})
export class PriceComponent {
  @Input() componentData: any;
  @ViewChild('fform') feedbackFormDirective: any;
  feedbackForm: any = FormGroup;
  loading: boolean = false;
  error: string = '';
  id: number = 0;

  formErrors: any = {
    price: '',
  };

  validationMessages: any = {
    price: {
      required: 'Required.',
      min: 'Minimum amount is 50',
    },
  };

  clickEventSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private service: ToggleNavService,
    private httpService: HttpService
  ) {
    this.createForm();

    this.authService.checkExpired();

    this.clickEventSubscription = this.service
      .getPropertyClickEvent()
      .subscribe((data: any) => {
        this.onSubmit(data);
      });

    let data: any = this.service.getPropertyMessage();
    this.id = data?.id;

    if (data?.price) {
      this.feedbackForm.patchValue({
        price: data.price?.price,
      });
    }
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      price: ['', [Validators.required, Validators.min(50)]],
    });

    this.feedbackForm.valueChanges.subscribe(() => this.onValueChanged());
    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged() {
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
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit(type: any) {
    if (type?.componentNumber == 14) {
      this.onValueChanged();
      const feed = this.feedbackFormDirective.invalid;
      if (feed) {
      } else {
        this.updateData(type);
      }
    }
  }

  updateData(type: any) {
    this.loading = true;

    let data: any = this.service.getPropertyMessage();

    this.httpService
      .updateData(
        data?.id
          ? baseUrl.draft + '/' + data?.id
          : baseUrl.listing + '/' + data?.uuid,
        {
          price_per_night: this.feedbackForm.value.price,
          cleaning_fee: 0,
          step: 14,
        }
      )
      .subscribe(
        (data2: any) => {
          this.loading = false;
          let data: any = this.service.getPropertyMessage();
          Object.assign(data, {
            price: this.feedbackForm.value,
            id: data?.id,
            uuid: data2?.data,
            type: 'summary',
          });

          this.service.setPropertyMessage(data);
          this.service.sendSubmitPropertyClickEvent({
            type: type?.type,
            componentNumber: 14,
          });
        },
        (err) => {
          this.loading = false;
          this.error =
            err?.error?.message ||
            err?.error?.msg ||
            err?.error?.detail ||
            'An error occured, please try again';

          this.service.sendSubmitPropertyClickEvent({
            type: 'error',
          });
        }
      );
  }
}
