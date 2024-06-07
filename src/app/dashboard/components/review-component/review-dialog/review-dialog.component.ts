import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { RatingModule } from 'primeng/rating';
import { baseUrl } from '../../../../../environments/environment';
import { HttpService } from '../../../../global-services/http.service';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';

@Component({
  selector: 'app-review-dialog',
  standalone: true,
  imports: [
    CommonModule,
    RatingModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './review-dialog.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./review-dialog.component.scss'],
})
export class ReviewDialogComponent {
  @Input() review: any;
  ratingValue: number = 3;
  @ViewChild('fform') feedbackFormDirective: any;
  feedbackForm: any = FormGroup;
  loading = false;
  disabled = false;

  formErrors: any = {
    message: '',
  };

  validationMessages: any = {
    message: {
      required: 'required.',
    },
  };

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private service: ToggleNavService,
    private snackBar: MatSnackBar,
    private httpService: HttpService
  ) {
    this.createForm();
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      message: ['', [Validators.required]],
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
              this.formErrors[field] = messages[key];
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
          baseUrl.listing +
            `/${
              this.review?.listing?.params?.listing ||
              this.review?.params?.listing
            }/reviews`,
          {
            booking_uuid:
              this.review?.listing?.params?.booking ||
              this.review?.params?.booking,
            public_rating: this.ratingValue,
            public_description: this.feedbackForm.value.message,
            type: 'public',
          }
        )
        .subscribe(
          () => {
            this.loading = false;
            this.disabled = false;

            this.service.sendToastClickEvent({
              success: true,
              message: 'Successfully added review',
            });

            setTimeout(() => {
              location.reload();
            }, 2000);
            this.closeDialog();
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

  closeDialog() {
    this.dialog.closeAll();
  }
}
