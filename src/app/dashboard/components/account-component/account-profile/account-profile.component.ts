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
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { PasswordStrengthMeterModule } from 'angular-password-strength-meter';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { SkeletonModule } from 'primeng/skeleton';
import { baseUrl } from '../../../../../environments/environment';
import { AuthService } from '../../../../global-services/auth.service';
import { HttpService } from '../../../../global-services/http.service';
import { MustMatch } from '../../../../helpers/must-match.validators';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';
import { InputRestrictionDirective } from '../../../directives/no-special-character.directive';
import { PersonalDetails } from '../../../model/form';

@Component({
  selector: 'app-account-profile',
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
    SkeletonModule,
    LazyLoadImageModule,
    InputRestrictionDirective,
    PasswordStrengthMeterModule
  ],
  templateUrl: './account-profile.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./account-profile.component.scss'],
})
export class AccountProfileComponent implements OnInit {
  @Input() userData: any;
  @ViewChild('fform') feedbackFormDirective: any;
  feedbackForm: any = FormGroup;
  feedbackPersonal!: PersonalDetails;
  loading: boolean = false;
  passwordLoading: boolean = false;
  imageLoading: boolean = false;
  hide: boolean = true;
  hide2: boolean = true;
  hide3: boolean = true;
  updateType = 'personal';
  editable: boolean = false;
  loadingProfile: boolean = false;
  httpSubscription: any;
  files: any;
  formData = new FormData();
  defaultImage: string = baseUrl?.defaultProfileImage;
  roles: any[] = [];
  editablePicture: boolean = false;

  isLoaded: boolean = false;

  formErrors: any = {
    newPassword: '',
    oldPassword: '',
    business_name: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    email2: '',
  };

  validationMessages: any = {
    firstName: {
      required: 'Required.',
      pattern: 'Not a valid name.',
      minlength: 'Not a valid name.',
    },
    business_name: {
      required: 'Required.',
      pattern: 'Symbols are not allowed',
    },
    lastName: {
      required: 'Required.',
      pattern: 'Not a valid name.',
      minlength: 'Not a valid name.',
    },
    phone: {
      required: 'Required.',
      maxlength: 'Not a valid phone number.',
    },
    email: {
      required: 'E-mail is required.',
      email: 'Not a valid e-mail.',
    },
    email2: {
      required: 'Required.',
    },
    oldPassword: {
      required: 'Required.',
    },
    newPassword: {
      minlength: 'Must be at least 8 characters.',
    },
    confirmPassword: {
      mustMatch: 'Must be equal to new password.',
    },
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private service: ToggleNavService,
    private httpService: HttpService,
    private snackBar: MatSnackBar
  ) {
    this.authService.checkExpired();
    this.createForm();
  }

  createForm() {
    this.feedbackForm = this.fb.group(
      {
        firstName: [
          '',
          [Validators.pattern('[a-zA-Z]*'), Validators.minLength(3)],
        ],
        lastName: [
          '',
          [Validators.pattern('[a-zA-Z]*'), Validators.minLength(3)],
        ],
        email: ['', [Validators.email]],
        email2: [''],
        phone: [''],
        business_name: [
          '',
          [Validators.pattern('^[a-zA-Z\\s\\d]*$'), Validators.minLength(1)],
        ],
        newPassword: [''],
        oldPassword: ['', [Validators.minLength(8)]],
        confirmPassword: [''],
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

  fileBrowseHandler(files: any) {
    const file = files.target.files[0];
    if (file) {
      this.files = URL.createObjectURL(file);
      this.formData.append('image', file);
      this.editablePicture = true;
    }
  }

  onSubmit() {
    this.onValueChanged();
    this.feedbackPersonal = this.feedbackForm.value;
    const feed = this.feedbackFormDirective.invalid;
    if (feed) {
    } else {
      this.loadingProfile = true;

      let data: any = {
        first_name: this.feedbackPersonal.firstName,
        last_name: this.feedbackPersonal.lastName,
        business_name: this.feedbackPersonal.business_name,
        emergency_contact: this.feedbackPersonal.email2,
      };

      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          if (data[key] == undefined || data[key] == '' || data[key] == null) {
            delete data[key];
          }
        }
      }

      if (data?.first_name == this.userData?.first_name) {
        delete data.first_name;
      }

      if (data?.last_name == this.userData?.last_name) {
        delete data.last_name;
      }

      if (data?.business_name == this.userData?.business_name) {
        delete data.business_name;
      }

      if (data?.emergency_contact == this.userData?.emergency_contact) {
        delete data.emergency_contact;
      }

      this.httpSubscription = this.httpService
        .updateData(baseUrl.profileDetails, data)
        .subscribe(
          (data: any) => {
            this.getProfileDetails();
            this.snackBar.open('Profile updated successfully', 'x', {
              duration: 3000,
              panelClass: 'success',
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
            this.loadingProfile = false;
          },
          (err) => {
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
            this.loadingProfile = false;
          }
        );
    }
  }

  getProfileDetails() {
    this.loading = true;
    this.httpService.getAuthSingle(baseUrl.profileDetails).subscribe(
      (data: any) => {
        this.userData = data?.data;

        for (let r of this.userData?.roles) {
          this.roles.push(r?.name?.toLowerCase());
        }

        this.service.setProfileMessage(data?.data);
        this.service.sendIsLoginClickEvent();
        this.updateProfileDetails();
        this.loading = false;
        this.editable = false;
      },
      (err) => {
        this.authService.checkExpired();
        this.loading = false;
      }
    );
  }

  updateImage() {
    if (this.files) {
      this.imageLoading = true;
      this.httpSubscription = this.httpService
        .postData(baseUrl.profileDetails + '/photo', this.formData)
        .subscribe(
          (data: any) => {
            this.getProfileDetails();
            this.snackBar.open('Profile photo updated successfully', 'x', {
              duration: 3000,
              panelClass: 'success',
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
            this.files = undefined;
            this.imageLoading = false;
            this.editablePicture = false;
          },
          (err) => {
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
            this.imageLoading = false;
          }
        );
    } else {
      this.snackBar.open('Please select a photo', 'x', {
        duration: 3000,
        panelClass: 'error',
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }
  }

  updatePassword() {
    if (
      this.feedbackForm.value.oldPassword &&
      this.feedbackForm.value.newPassword &&
      this.feedbackForm.value.confirmPassword
    ) {
      this.passwordLoading = true;
      this.httpSubscription = this.httpService
        .updateData(baseUrl.profileDetails, {
          current_password: this.feedbackForm.value.oldPassword,
          new_password: this.feedbackForm.value.newPassword,
        })
        .subscribe(
          (data: any) => {
            this.snackBar.open('Password updated successfully', 'x', {
              duration: 3000,
              panelClass: 'success',
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
            this.feedbackForm.patchValue({
              newPassword: '',
              oldPassword: '',
              confirmPassword: '',
            });
            this.getProfileDetails();
            this.passwordLoading = false;
          },
          (err) => {
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
            this.passwordLoading = false;
          }
        );
    } else {
      this.snackBar.open('Please fill in all fields', 'x', {
        duration: 3000,
        panelClass: 'error',
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }
  }

  updateProfileDetails() {
    this.userData = this.service.getProfileMessage();
    this.feedbackForm.patchValue({
      firstName: this.userData?.first_name,
      lastName: this.userData?.last_name,
      email: this.userData?.email,
      email2: this.userData?.emergency_contact,
      business_name: this.userData?.business_name,
      phone: this.userData?.phone?.slice(4),
    });
    this.feedbackForm.disable();
  }

  edit() {
    this.editable = true;
    this.feedbackForm.enable();
    this.feedbackForm.get('email')?.disable();
    this.feedbackForm.get('phone')?.disable();
  }

  cancel() {
    if (this.httpSubscription) {
      this.httpSubscription.unsubscribe();
    }
    this.loadingProfile = false;
    this.imageLoading = false;
    this.passwordLoading = false;
  }

  ngOnInit(): void {
    if (!this.userData) {
      this.getProfileDetails();
    } else {
      for (let r of this.userData?.roles) {
        this.roles.push(r?.name?.toLowerCase());
      }
      this.updateProfileDetails();
    }
  }
}
