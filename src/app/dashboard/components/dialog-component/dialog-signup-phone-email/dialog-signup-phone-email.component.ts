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
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { InputRestrictionDirective } from 'src/app/dashboard/directives/no-special-character.directive';
import { baseUrl } from '../../../../../environments/environment';
import { HttpService } from '../../../../global-services/http.service';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';
import { RequestResetPassword } from '../../../model/form';
import { DialogComponent } from '../../dialog/dialog.component';
import { NgxMatIntlTelInputComponent } from '../../ngx-material-intl-tel-input/ngx-mat-intl-tel-input.component';

@Component({
  selector: 'app-dialog-signup-phone-email',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DividerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    InputRestrictionDirective,
    NgxMatIntlTelInputComponent,
  ],
  templateUrl: './dialog-signup-phone-email.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./dialog-signup-phone-email.component.scss'],
})
export class DialogSignupPhoneEmailComponent {
  @Input() data: any;
  email: boolean = true;

  @ViewChild('fform') feedbackFormDirective: any;
  feedbackForm: any = FormGroup;
  feedback!: RequestResetPassword;
  loading = false;

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
    private router: Router,
    private service: ToggleNavService,
    private dialog: MatDialog,
    private httpService: HttpService,
    private snackBar: MatSnackBar
  ) {
    this.createForm();
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      email: ['', [Validators.required]],
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
      return;
    } else {
      this.loading = true;

      this.httpService
        .postData(
          baseUrl.signupRequestVerification,
          this.email
            ? { email: this.feedback.email, type: 'email' }
            : { phone: this.feedback.email, type: 'phone' }
        )
        .subscribe(
          (data: any) => {
            this.loading = false;
            if (data?.message.includes('Verification has been sent to your')) {
              this.service.sendSignupClickEvent({
                requestType: 'confirm',
                requestMessage: ` ${
                  this.email
                    ? 'Please check your email'
                    : 'Confirm your phone number'
                }`,
                email: this.email ? this.feedback.email : this.feedback.email,
                isEmail: this.email,
              });
            } else {
              this.service.sendSignupClickEvent({
                requestType: 'details',
                requestMessage: 'Add your details',
                email: this.email ? this.feedback.email : this.feedback.email,
                code: '7878',
                isEmail: this.email ? true : false,
              });
            }
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

  closeDialog() {
    this.dialog.closeAll();
    this.router.navigate(['/forget-password']);
  }

  redirectToPolicy(url: string) {
    this.router.navigate([url]);
    this.dialog.closeAll();
  }

  openDialog(data: any, type: string) {
    this.dialog.closeAll();
    this.dialog.open(DialogComponent, {
      data: {
        type: type,
        data: data,
      },
    });
  }
}
