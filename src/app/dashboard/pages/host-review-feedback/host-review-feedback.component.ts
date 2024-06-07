import { CommonModule } from '@angular/common';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { RatingModule } from 'primeng/rating';
import { baseUrl } from '../../../../environments/environment';
import { HttpService } from '../../../global-services/http.service';
import { BackButtonComponent } from '../../components/back-button/back-button.component';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-host-review-feedback',
  standalone: true,
  imports: [
    CommonModule,
    RatingModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    LazyLoadImageModule,
    BackButtonComponent,
    MatSlideToggleModule,
    MatRadioModule,
  ],
  templateUrl: './host-review-feedback.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./host-review-feedback.component.scss'],
})
export class HostReviewFeedbackComponent {
  @ViewChild('fform') feedbackFormDirective: any;
  feedbackForm: any = FormGroup;
  cleanValue: number = 3;
  comunicationValue: number = 3;
  rulesValue: number = 3;
  loading: boolean = false;
  disabled: boolean = false;
  data: any;
  dafaultImage: string = baseUrl.defaultImage;

  formErrors: any = {
    description: '',
    description2: '',
  };

  validationMessages: any = {
    description: {
      required: 'Required.',
    },
    description2: {
      required: 'Required.',
    },
    guest_checked_out: {
      required: 'Required.',
    },
  };

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private httpService: HttpService,
    private router: Router,
    private direct: ActivatedRoute
  ) {
    this.createForm();

    this.direct.paramMap.subscribe((params) => {
      let id: any = params.get('id');
      this.data = JSON.parse(atob(id));
    });
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      description: ['', [Validators.required]],
      description2: ['', [Validators.required]],
      guest_checked_out: [false, [Validators.required]],
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
    const feed = this.feedbackFormDirective.invalid;
    if (feed) {
    } else {
      this.loading = true;
      this.disabled = true;

      this.httpService
        .postData(
          baseUrl.listing + `/${this.data?.listing_uuid}/host-reviews`,
          {
            experience: this.feedbackForm.value.description,
            feedback: this.feedbackForm.value.description2,
            booking_uuid: this.data?.booking_uuid,
            cleanliness: this.cleanValue,
            has_guest_checked_out: this.feedbackForm.value.guest_checked_out,
            expectations:
              this.feedbackForm.value.description ||
              this.feedbackForm.value.description2,
            communication: this.comunicationValue,
            observance_of_house_rules: this.rulesValue,
            type: 'private',
          }
        )
        .subscribe(
          (data: any) => {
            this.loading = false;
            this.disabled = false;

            this.openDialog({
              message: 'Thank you for your feedback!',
              requestType: 'success-error',
              requestMessage: '',
            });

            this.router.navigate(['/home']);
          },
          (err) => {
            this.loading = false;
            this.disabled = false;

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

  openDialog(data: any) {
    this.dialog.closeAll();
    this.dialog.open(DialogComponent, {
      data: {
        type: 'dialog',
        data: data,
      },
    });
  }
}
