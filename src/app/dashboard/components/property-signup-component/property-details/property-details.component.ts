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
  selector: 'app-property-details',
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
  templateUrl: './property-details.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./property-details.component.scss'],
})
export class PropertyDetailsComponent {
  @Input() componentData: any;
  @ViewChild('fform') feedbackFormDirective: any;
  feedbackForm: any = FormGroup;
  loading: boolean = false;
  error: string = '';
  id: number = 0;

  formErrors: any = {
    title: '',
    description: '',
    apartment_size: '',
  };

  validationMessages: any = {
    title: {
      required: 'Required.',
      pattern: 'Symbols are not allowed',
    },
    description: {
      required: 'Required.',
      pattern: 'Symbols are not allowed',
    },
    apartment_size: {
      min: 'Invalid apartment size.',
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

    if (data?.propertyDetails) {
      this.feedbackForm.patchValue({
        title: data.propertyDetails?.title,
        description: data.propertyDetails?.description,
        apartment_size: data.propertyDetails?.apartment_size,
      });
    }
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      title: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z\\s\\d]*$')],
      ],
      description: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z\\s\\d]*$')],
      ],
      apartment_size: ['', [Validators.min(1)]],
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
    if (type?.componentNumber == 9) {
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
          title: this.feedbackForm.value.title,
          description: this.feedbackForm.value.description,
          apartment_size: this.feedbackForm.value.apartment_size || '',
          step: 9,
        }
      )
      .subscribe(
        () => {
          this.loading = false;
          let data: any = this.service.getPropertyMessage();
          Object.assign(data, {
            propertyDetails: this.feedbackForm.value,
          });

          this.service.setPropertyMessage(data);
          this.feedbackFormDirective.resetForm();
          this.service.sendSubmitPropertyClickEvent({
            type: type?.type,
            componentNumber: 9,
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
