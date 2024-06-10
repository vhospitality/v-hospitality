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
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { AuthService } from '../../../../global-services/auth.service';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';
import { NativeElementInjectorDirective } from '../../../directives/native-element-injector.directive';
import { InputRestrictionDirective } from '../../../directives/no-special-character.directive';
import { allCountries } from '../../../model/country';
import { CountryISO } from '../../../model/enums/country-iso.enum';
import { PhoneNumberFormat } from '../../../model/enums/phone-number-format.enum';
import { SearchCountryField } from '../../../model/enums/search-country-field.enum';
import { Login } from '../../../model/form';
import { DialogComponent } from '../../dialog/dialog.component';
import { NgxMatIntlTelInputComponent } from '../../ngx-material-intl-tel-input/ngx-mat-intl-tel-input.component';

@Component({
  selector: 'app-dialog-login',
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
    DropdownModule,
    NativeElementInjectorDirective,
    MatSelectModule,
    MatIconModule,
    InputRestrictionDirective,
    NgxMatIntlTelInputComponent,
  ],
  templateUrl: './dialog-login.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./dialog-login.component.scss'],
})
export class DialogLoginComponent {
  @Input() data: any;
  email: boolean = true;
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  countries: any = allCountries;
  hide: boolean = true;

  @ViewChild('fform') feedbackFormDirective: any;
  feedbackForm: any = FormGroup;
  feedback!: Login;
  loading = false;

  formErrors: any = {
    email: '',
    password: '',
  };

  validationMessages: any = {
    email: {
      required: 'Required.',
      email: 'Not a valid e-mail.',
      // maxlength: 'Not a valid phone number.',
      // minlength: 'Not a valid phone number.',
    },
    password: {
      required: 'Required.',
    },
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private service: ToggleNavService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.createForm();
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      country: [''],
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
      this.authService
        .login(
          this.email
            ? {
                email: this.feedback.email,
                password: this.feedback.password,
              }
            : {
                phone: this.feedback.email,
                password: this.feedback.password,
              }
        )
        .subscribe((data: any) => {
          this.loading = false;
          if (data) {
            this.service.sendIsLoginClickEvent();
            this.service.sendNotificatonHeaderClickEvent();

            if (
              this.router.url.includes('/accommodations-details') ||
              this.router.url.includes('/host-subscription')
            ) {
              return;
            } else {
              const returnUrl =
                this.route.snapshot.queryParams['returnUrl'] || '/';
              this.router.navigateByUrl(returnUrl);
            }

            this.dialog.closeAll();
          }
        });
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
