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
  FormControl,
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
import { DividerModule } from 'primeng/divider';
import { baseUrl } from '../../../../../environments/environment';
import { AuthService } from '../../../../global-services/auth.service';
import { HttpService } from '../../../../global-services/http.service';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-initiate-payout-dialog',
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
  ],
  templateUrl: './initiate-payout-dialog.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./initiate-payout-dialog.component.scss'],
})
export class InitiatePayoutDialogComponent implements OnInit {
  @Input() payout: any;
  @ViewChild('fform') feedbackFormDirective: any;
  feedbackForm: any = FormGroup;
  loading = false;
  disabled = false;
  userData: any = this.service.getProfileMessage();

  formErrors: any = {
    name: '',
    bank: '',
    account_number: '',
    amount: '',
    fee: '',
  };

  validationMessages: any = {
    name: {
      required: 'Required.',
    },
    bank: {
      required: 'Required.',
    },
    account_number: {
      required: 'Required.',
    },
    amount: {
      required: 'Required.',
      min: 'Minimum amount is 50',
    },
  };

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private authService: AuthService,
    private httpService: HttpService,
    private snackBar: MatSnackBar,
    private service: ToggleNavService
  ) {
    this.createForm();
    this.authService.checkExpired();
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      name: ['', [Validators.required]],
      bank: ['', [Validators.required]],
      account_number: ['', [Validators.required]],
      amount: [50, [Validators.required, Validators.min(50)]],
      balance: [''],
      fee: [10],
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
      return;
    } else {
      this.loading = true;
      this.disabled = true;

      this.httpService
        .postData(baseUrl.otp, {
          type: 'withdrawal',
          amount: this.feedbackForm.value.amount,
        })
        .subscribe(
          (data: any) => {
            this.loading = false;
            this.disabled = false;

            this.openDialog(
              {
                accountData: this.payout?.data || this.payout,
                serverData: data?.data,
                formData: this.feedbackForm.value,
              },
              'otp-payout'
            );
          },
          (err) => {
            this.loading = false;
            this.disabled = false;
            this.authService.checkExpired();
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

  ngOnInit(): void {
    this.userData = this.service.getProfileMessage();

    this.feedbackForm.patchValue({
      name: this.payout?.account_name || this.payout?.data?.account_name,
      bank: this.payout?.bank_name || this.payout?.data?.bank_name,
      account_number:
        this.payout?.account_number || this.payout?.data?.account_number,
      amount: this.payout?.amount || 50,
      balance: this.userData?.wallet_available_balance,
    });
    this.feedbackForm.disable();
    this.feedbackForm.get('amount').enable();

    this.feedbackForm.get('amount').valueChanges.subscribe((value: any) => {
      this.feedbackForm.patchValue({
        fee: this.calculateTransferFee(value),
      });
    });
  }

  calculateTransferFee(amount: number) {
    if (amount <= 5000) {
      return 10; // NGN 10 for transfers of NGN 5,000 and below
    } else if (amount <= 50000) {
      return 25; // NGN 25 for transfers between NGN 5,001 and NGN 50,000
    } else {
      return 50; // NGN 50 for transfers above NGN 50,000
    }
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
