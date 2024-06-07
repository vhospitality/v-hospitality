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
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { baseUrl } from '../../../../../environments/environment';
import { AuthService } from '../../../../global-services/auth.service';
import { HttpService } from '../../../../global-services/http.service';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-policy-rules',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './policy-rules.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./policy-rules.component.scss'],
})
export class PolicyRulesComponent implements OnInit {
  @Input() listingDetails: any;
  data: any[] = [];

  @ViewChild('fform') feedbackFormDirective: any;
  feedbackForm: any = FormGroup;
  loading: boolean = false;
  disabled: boolean = false;
  editable: boolean = false;

  formErrors: any = {
    checkin: '',
    checkout: '',
  };

  validationMessages: any = {
    checkin: {
      required: 'Required.',
    },
    checkout: {
      required: 'Required.',
    },
  };

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private httpService: HttpService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private service: ToggleNavService,
    private router: Router
  ) {
    this.createForm();
    this.authService.checkExpired();
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      checkout: ['', [Validators.required]],
      checkin: ['', [Validators.required]],
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

  changeActive(name: string) {
    this.data.find((n: any) => {
      if (n?.name == name) {
        n.value = !n.value;
      }
    });
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

  onSubmit() {
    this.loading = true;

    const check_in = this.feedbackForm.value.checkin.split(':');
    const check_out = this.feedbackForm.value.checkout.split(':');

    this.httpService
      .updateData(baseUrl.listing + '/' + this.listingDetails?.uuid, {
        check_in: check_in[0] + ':' + check_in[1],
        check_out: check_out[0] + ':' + check_out[1],
      })
      .subscribe(
        () => {
          this.openDialog({
            message: 'Successfully updated house rules',
            requestType: 'success-error',
            requestMessage: '',
          });
          this.loading = false;
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

  edit(step: number) {
    let accommodationDetails: any = this.service.getAccommodationMessage();

    Object.assign(accommodationDetails, {
      step: step,
    });

    this.service.setAccommodationMessage(accommodationDetails);
    this.service.setPropertyMessage(accommodationDetails);
    this.router.navigate(['/property-signup']);
  }

  ngOnInit(): void {
    this.feedbackForm.patchValue({
      checkin: this.listingDetails?.houseRulesTime?.checkin,
      checkout: this.listingDetails?.houseRulesTime?.checkout,
    });
  }
}
