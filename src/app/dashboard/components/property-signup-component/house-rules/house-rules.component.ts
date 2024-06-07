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
  selector: 'app-house-rules',
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
  templateUrl: './house-rules.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./house-rules.component.scss'],
})
export class HouseRulesComponent {
  @Input() componentData: any;
  @ViewChild('fform') feedbackFormDirective: any;
  feedbackForm: any = FormGroup;
  loading: boolean = false;
  error: string = '';
  id: number = 0;

  formErrors: any = {
    checkin: '',
    checkout: '',
  };

  validationMessages: any = {
    checkin: {
      required: 'Required.',
    },
    checkout: {
      required: 'Required.',
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

    if (data?.houseRulesTime) {
      this.feedbackForm.patchValue({
        checkin: data.houseRulesTime?.checkin || '11:59',
        checkout: data.houseRulesTime?.checkout || '13:01',
      });
    }
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      checkin: ['11:59', [Validators.required]],
      checkout: ['13:01', [Validators.required]],
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
    if (type?.componentNumber == 12) {
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
    const check_in =
      this.feedbackForm.value.checkin.split(':') ||
      data.houseRulesTime?.checkin?.split(':');
    const check_out =
      this.feedbackForm.value.checkout.split(':') ||
      data.houseRulesTime?.checkout?.split(':');

    this.httpService
      .updateData(
        data?.id
          ? baseUrl.draft + '/' + data?.id
          : baseUrl.listing + '/' + data?.uuid,
        {
          check_in: check_in[0] + ':' + check_in[1],
          check_out: check_out[0] + ':' + check_out[1],
          step: 12,
        }
      )
      .subscribe(
        () => {
          this.loading = false;
          let data: any = this.service.getPropertyMessage();
          Object.assign(data, {
            houseRulesTime: this.feedbackForm.value,
          });

          this.service.setPropertyMessage(data);
          this.service.sendSubmitPropertyClickEvent({
            type: type?.type,
            componentNumber: 12,
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
