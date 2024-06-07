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
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { baseUrl } from '../../../../../environments/environment';
import { HttpService } from '../../../../global-services/http.service';
import { MustMatch } from '../../../../helpers/must-match.validators';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';
import { ResetPassword } from '../../../model/form';

@Component({
  selector: 'app-forgot-password-set-new',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatIconModule,
  ],
  templateUrl: './forgot-password-set-new.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./forgot-password-set-new.component.scss'],
})
export class ForgotPasswordSetNewComponent {
  @Input() data: any;
  @ViewChild('fform') feedbackFormDirective: any;
  feedbackForm: any = FormGroup;
  feedback!: ResetPassword;
  loading = false;
  hide: boolean = true;
  hide2: boolean = true;

  formErrors: any = {
    newPassword: '',
    confirmPassword: '',
  };

  validationMessages: any = {
    newPassword: {
      required: 'Password is required.',
      minlength: 'Must be at least 8 characters.',
    },
    confirmPassword: {
      required: 'Required.',
      mustMatch: 'Must be equal to new password.',
    },
  };

  constructor(
    private fb: FormBuilder,
    private service: ToggleNavService,
    private httpService: HttpService,
    private snackBar: MatSnackBar
  ) {
    this.createForm();
  }

  createForm() {
    this.feedbackForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validator: MustMatch('newPassword', 'confirmPassword'),
      }
    );

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
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.onValueChanged();
    this.feedback = this.feedbackForm.value;
    const feed = this.feedbackFormDirective.invalid;
    if (feed) {
    } else {
      this.loading = true;
      this.httpService
        .updatePutData(
          baseUrl.requestResetPassword + '/update',
          this.data?.isEmail
            ? {
                email: this.data?.email,
                type: 'email',
                password: this.feedback.confirmPassword,
              }
            : {
                phone: this.data?.email,
                type: 'phone',
                password: this.feedback.confirmPassword,
              }
        )
        .subscribe(
          () => {
            this.loading = false;

            this.service.sendClickEvent({
              requestType: 'success-error',
              password: true,
              email: this.data?.email,
            });
          },
          (err) => {
            this.loading = false;
            this.snackBar.open(
              err?.error?.message ||
                err?.error?.msg ||
                err?.error?.detail ||
                err?.error?.status ||
                'An error occured!',
              'x',
              {
                duration: 5000,
                panelClass: 'error',
                horizontalPosition: 'center',
                verticalPosition: 'top',
              }
            );
          }
        );
    }
  }
}
