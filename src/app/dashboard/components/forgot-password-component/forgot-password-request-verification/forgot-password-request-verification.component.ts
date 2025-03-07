import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { baseUrl } from '../../../../../environments/environment';
import { HttpService } from '../../../../global-services/http.service';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';
import { InputRestrictionDirective } from '../../../directives/no-special-character.directive';
import { RequestResetPassword } from '../../../model/form';
import { NgxMatIntlTelInputComponent } from '../../ngx-material-intl-tel-input/ngx-mat-intl-tel-input.component';

@Component({
  selector: 'app-forgot-password-request-verification',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    InputRestrictionDirective,
    NgxMatIntlTelInputComponent,
  ],
  templateUrl: './forgot-password-request-verification.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./forgot-password-request-verification.component.scss'],
})
export class ForgotPasswordRequestVerificationComponent implements OnInit {
  @Input() data: any;
  @ViewChild('fform') feedbackFormDirective: any;
  feedbackForm: any = FormGroup;
  feedback!: RequestResetPassword;
  loading = false;
  email: boolean = true;

  formErrors: any = {
    email: '',
  };

  validationMessages: any = {
    email: {
      required: 'Required.',
      email: 'Not a valid e-mail.',
      maxlength: 'Not a valid phone number.',
      minlength: 'Not a valid phone number.',
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
    this.feedbackForm = this.fb.group({
      email: ['', [Validators.required]],
      // email: ['', [Validators.required, Validators.email]],
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

  onSubmit() {
    this.onValueChanged();
    this.feedback = this.feedbackForm.value;
    const feed = this.feedbackFormDirective.invalid;
    if (feed) {
    } else {
      this.loading = true;
      this.httpService
        .postData(
          baseUrl.requestResetPassword,
          this.email
            ? { email: this.feedback.email, type: 'email' }
            : { phone: this.feedback.email, type: 'phone' }
        )
        .subscribe(
          (data: any) => {
            this.loading = false;

            this.snackBar.open(
              data?.message ||
                data?.msg ||
                data?.detail ||
                'Otp sent successfully',
              'x',
              {
                duration: 5000,
                panelClass: 'success',
                horizontalPosition: 'center',
                verticalPosition: 'top',
              }
            );

            this.service.sendClickEvent({
              requestType: 'default',
              password: true,
              email: this.email ? this.feedback.email : this.feedback.email,
              isEmail: this.email,
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

  ngOnInit(): void {
    this.feedbackForm.patchValue({
      email: this.data?.email,
    });
  }
}
