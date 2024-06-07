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
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { baseUrl } from '../../../../../environments/environment';
import { AuthService } from '../../../../global-services/auth.service';
import { HttpService } from '../../../../global-services/http.service';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-price-availability',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './price-availability.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./price-availability.component.scss'],
})
export class PriceAvailabilityComponent implements OnInit {
  @Input() listingDetails: any;
  @ViewChild('fform') feedbackFormDirective: any;
  feedbackForm: any = FormGroup;
  loading: boolean = false;
  disabled: boolean = false;
  editable: boolean = false;
  httpSubscription: any;

  formErrors: any = {
    price: '',
    min: '',
    max: '',
  };

  validationMessages: any = {
    price: {
      required: 'Required.',
    },
    min: {
      required: 'Required.',
    },
    max: {
      required: 'Required.',
    },
  };

  constructor(
    private dialog: MatDialog,
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
    this.feedbackForm = this.fb.group({
      price: ['', [Validators.required]],
      min: ['', [Validators.required]],
      max: ['', [Validators.required]],
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
        if (control && control.dirty && !control.valid) {
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

      this.httpSubscription = this.httpService
        .updateData(baseUrl.listing + '/' + this.listingDetails?.uuid, {
          minimum_nights: this.feedbackForm.value.min,
          maximum_nights: this.feedbackForm.value.max,
          price_per_night: this.feedbackForm.value.price,
        })
        .subscribe(
          () => {
            this.openDialog({
              message: 'Successfully updated pricing and availability',
              requestType: 'success-error',
              requestMessage: '',
            });
            this.editable = false;
            this.loading = false;
            this.feedbackForm.disable();
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
            this.loading = false;
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

  edit() {
    this.editable = true;
    this.feedbackForm.enable();
  }

  cancel() {
    this.editable = false;
    if (this.httpSubscription) {
      this.httpSubscription.unsubscribe();
    }
    this.feedbackForm.disable();
  }

  ngOnInit(): void {
    this.feedbackForm.patchValue({
      price: this.listingDetails?.price?.price,
      min: this.listingDetails?.guestStay?.min,
      max: this.listingDetails?.guestStay?.max,
    });
    this.feedbackForm.disable();
  }
}
