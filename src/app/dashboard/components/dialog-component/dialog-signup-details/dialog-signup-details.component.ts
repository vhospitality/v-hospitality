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
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { PasswordStrengthMeterModule } from 'angular-password-strength-meter';
import { DialogModule } from 'primeng/dialog';
import { Observable, Subject } from 'rxjs';
import { baseUrl } from '../../../../../environments/environment';
import { AuthService } from '../../../../global-services/auth.service';
import { HttpService } from '../../../../global-services/http.service';
import { MustMatch } from '../../../../helpers/must-match.validators';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';
import { InputRestrictionDirective } from '../../../directives/no-special-character.directive';
import { Signup } from '../../../model/form';
import { NgxMatIntlTelInputComponent } from '../../ngx-material-intl-tel-input/ngx-mat-intl-tel-input.component';

export const StrongPasswordRegx: RegExp =
  /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

@Component({
  selector: 'app-dialog-signup-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule,
    InputRestrictionDirective,
    DialogModule,
    PasswordStrengthMeterModule,
    NgxMatIntlTelInputComponent,
  ],
  templateUrl: './dialog-signup-details.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./dialog-signup-details.component.scss'],
})
export class DialogSignupDetailsComponent implements OnInit {
  visible: boolean = false;
  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  image: any;
  file: any;
  public videoOptions: MediaTrackConstraints = {};
  @Input() data: any;
  hide: boolean = true;
  hide2: boolean = true;
  @ViewChild('fform') feedbackFormDirective: any;
  feedbackForm: any = FormGroup;
  feedback!: Signup;
  loading = false;
  disabled = false;
  days: any[] = [];
  years: any[] = [];
  months: any = [
    { value: 'Jan', viewValue: '01' },
    { value: 'Feb', viewValue: '02' },
    { value: 'Mar', viewValue: '03' },
    { value: 'Apr', viewValue: '04' },
    { value: 'May', viewValue: '05' },
    { value: 'Jun', viewValue: '06' },
    { value: 'Jul', viewValue: '07' },
    { value: 'Aug', viewValue: '08' },
    { value: 'Sep', viewValue: '08' },
    { value: 'Oct', viewValue: '10' },
    { value: 'Nov', viewValue: '11' },
    { value: 'Dec', viewValue: '12' },
  ];

  formErrors: any = {
    newPassword: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    month: '',
    day: '',
    year: '',
    nin: '',
    email: '',
    phone: '',
  };

  validationMessages: any = {
    firstName: {
      required: 'Required.',
      pattern: 'Not a valid name.',
      minlength: 'Not a valid name.',
    },
    email: {
      required: 'Required.',
      email: 'Not a valid e-mail.',
    },
    phone: {
      required: 'Required.',
      // maxlength: 'Not a valid phone number.',
      // minlength: 'Not a valid phone number.',
    },
    lastName: {
      required: 'Required.',
      pattern: 'Not a valid name.',
      minlength: 'Not a valid name.',
    },
    month: {
      required: 'Required.',
    },
    day: {
      required: 'Required.',
    },
    year: {
      required: 'Required.',
    },
    nin: {
      required: 'Required.',
      maxlength: 'Must be 11 digits.',
      minlength: 'Must be 11 digits.',
    },
    newPassword: {
      required: 'Password is required.',
    },
    confirmPassword: {
      required: 'Required.',
      mustMatch: 'Must be equal to new password.',
    },
  };

  phone: any = 'phone';

  constructor(
    private fb: FormBuilder,
    private service: ToggleNavService,
    private httpService: HttpService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    public dialog: MatDialog
  ) {
    this.createForm();

    for (let i = 1; i < 32; i++) {
      if (i < 10) {
        this.days.push({ day: '0' + i });
      } else {
        this.days.push({ day: i });
      }
    }

    for (let i = 1950; i < Number(new Date().getFullYear()); i++) {
      this.years.unshift({ year: i });
    }
  }

  fileBrowseHandler(files: any) {
    const file = files.target.files[0];
    if (file) {
      this.file = file;
      this.image = URL.createObjectURL(file);
    }
  }

  createForm() {
    this.feedbackForm = this.fb.group(
      {
        firstName: [
          '',
          [
            Validators.required,
            Validators.pattern('[a-zA-Z]*'),
            Validators.minLength(3),
          ],
        ],
        lastName: [
          '',
          [
            Validators.required,
            Validators.pattern('[a-zA-Z]*'),
            Validators.minLength(3),
          ],
        ],
        month: ['', [Validators.required]],
        day: ['', [Validators.required]],
        year: ['', [Validators.required]],
        email: ['', [Validators.required]],
        phone: ['', [Validators.required]],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(StrongPasswordRegx),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validator: MustMatch('newPassword', 'confirmPassword'),
      }
    );

    this.feedbackForm.valueChanges.subscribe(() => this.onValueChanged());
    this.onValueChanged(); // (re)set validation messages now
  }

  get passwordFormField() {
    return this.feedbackForm.get('newPassword');
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

  registerForMessaging(data: any) {
    this.httpService
      .registerForChat(baseUrl.messagingUrl + 'user', {
        first_name: data?.first_name,
        last_name: data?.last_name,
        u_id: data?.uuid,
        profile_picture: data?.profile_picture,
      })
      .subscribe();
  }

  // Display error message if user denies access to their camera
  handleInitError(event: any): void {
    if (event?.mediaStreamError?.name === 'NotAllowedError')
      this.snackBar.open(`Please allow camera access to take a picture`, 'x', {
        duration: 4000,
        panelClass: 'error',
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  // Take picture
  takePicture(): void {
    this.trigger.next();
    this.visible = false;
  }

  // Convert base64 image to file image
  dataURLtoFile(dataurl: any) {
    let arr = dataurl.split(','),
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], 'profile-picture.webp', { type: 'image/webp' });
  }

  onSubmit() {
    this.onValueChanged();
    this.feedback = this.feedbackForm.value;
    const feed = this.feedbackFormDirective.invalid;
    if (feed) {
      return;
    } else {
      const age = Number(new Date().getFullYear()) - Number(this.feedback.year);

      if (age < 18) {
        this.snackBar.open('You must be 18 years or older to register!', 'x', {
          duration: 5000,
          panelClass: 'error',
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      } else {
        if (this.image) {
          this.loading = true;

          const userData = {
            first_name: this.feedback?.firstName,
            last_name: this.feedback?.lastName,
            email: this.data?.isEmail ? this.data?.email : this.feedback?.email,
            phone: !this.data?.isEmail ? this.data?.email : this.feedback.phone,
            dob: `${this.feedback?.year}-${this.feedback?.month}-${this.feedback?.day}`,
            password: this.feedback?.confirmPassword,
            user_type: 'guest',
          };

          let formData: any = new FormData();
          formData.append('image', this.file);
          formData.append('first_name', this.feedback?.firstName);
          formData.append('last_name', this.feedback?.lastName);
          formData.append(
            'email',
            this.data?.isEmail ? this.data?.email : this.feedback?.email
          );
          formData.append(
            'phone',
            !this.data?.isEmail ? this.data?.email : this.feedback.phone
          );
          formData.append(
            'dob',
            `${this.feedback?.year}-${this.feedback?.month}-${this.feedback?.day}`
          );
          formData.append('password', this.feedback?.confirmPassword);
          formData.append('user_type', 'guest');

          this.httpService.postData(baseUrl.register, formData).subscribe(
            (data: any) => {
              this.loading = false;

              this.authService.storeTokens({ access: data?.data?.token });
              this.service.setProfileMessage(data?.data?.user);
              this.registerForMessaging(data?.data?.user);
              this.service.sendIsLoginClickEvent();

              this.service.sendSignupClickEvent({
                requestType: 'thankyou',
                // requestType: 'upload',
                requestMessage: '',
                userData: userData,
                email: this.data?.email,
                isEmail: this.data?.isEmail,
              });

              // setTimeout(() => {
              //   this.dialog.open(DialogComponent, {
              //     data: {
              //       type: 'dialog',
              //       data: {
              //         requestType: 'identity',
              //         requestMessage: 'Please verify your identity',
              //         data: '',
              //       },
              //     },
              //   });
              // }, 5000);
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
        } else {
          this.snackBar.open('Please take a photo', 'x', {
            duration: 3000,
            panelClass: 'error',
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        }
      }
    }
  }

  ngOnInit(): void {
    if (this.data?.isEmail) {
      this.feedbackForm.get('email').setValue(this.data?.email);
      this.feedbackForm.get('email').disable();
    } else {
      this.feedbackForm.get('phone').setValue(this.data?.email);
      this.feedbackForm.get('phone').disable();
    }
  }
}
