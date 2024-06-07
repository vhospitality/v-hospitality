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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SkeletonModule } from 'primeng/skeleton';
import { Observable, map, startWith } from 'rxjs';
import { baseUrl } from '../../../../../environments/environment';
import { AuthService } from '../../../../global-services/auth.service';
import { HttpService } from '../../../../global-services/http.service';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';
import { DialogComponent } from '../../dialog/dialog.component';
import { NoDataMessageComponent } from '../../no-data-message/no-data-message.component';

@Component({
  selector: 'app-account-payout',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatAutocompleteModule,
    SkeletonModule,
    NoDataMessageComponent,
  ],
  templateUrl: './account-payout.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./account-payout.component.scss'],
})
export class AccountPayoutComponent implements OnInit {
  @Input() userData: any;
  @ViewChild('fform') feedbackFormDirective: any;
  feedbackForm: any = FormGroup;
  loadingBanks: boolean = false;
  actionType: string = 'empty';
  options: any[] = [];
  filteredOptions: Observable<any[]> | any;
  accountDetails: any;
  fetchingDetails: boolean = false;
  accountDetailsError: string = '';
  httpSubscription: any;
  savingPayout: boolean = false;
  loadingPayouts: boolean = false;
  updatingPayout: any;
  payouts: any;
  updatePayoutSubscription: any;
  deletePayoutSubscription: any;
  deletingPayout: any;

  formErrors: any = {
    bankName: '',
    accountName: '',
    accountNumber: '',
  };

  validationMessages: any = {
    bankName: {
      required: 'Required.',
    },
    accountNumber: {
      required: 'Required.',
      maxlength: 'Account number not complete.',
      minlength: 'Account number not complete.',
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
    this.createForm();
    this.getBankList();

    let bankList: any = this.service.getBankListMessage();
    this.options = bankList;

    let payouts: any = this.service.getPayoutMessage();
    this.payouts = payouts;

    if (!this.payouts) {
      this.getPayouts();
    } else {
      this.actionType = 'save';
    }

    if (this.options?.length === 0) {
      this.getBankList();
    } else {
      this.autoFIllBankList();
    }
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      bankName: ['', [Validators.required]],
      accountNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      accountName: [{ value: '', disabled: true }],
    });

    this.feedbackForm.valueChanges.subscribe(() => {
      this.onValueChanged();
      this.fetchAccountDetails();
    });
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

  getBankList() {
    this.loadingBanks = true;
    this.httpService.getAuthSingle(baseUrl.bankList).subscribe(
      (data: any) => {
        this.options = data?.data;
        this.autoFIllBankList();
        this.service.setBankListMessage(data?.data);
        this.loadingBanks = false;
      },
      () => {
        this.authService.checkExpired();
        this.loadingBanks = false;
      }
    );
  }

  getPayouts() {
    this.loadingPayouts = true;
    this.payouts = undefined;
    this.httpService.getAuthSingle(baseUrl.bank).subscribe(
      (data: any) => {
        this.payouts = data?.data;
        if (this.payouts?.length > 0) {
          this.actionType = 'save';
        } else {
          this.actionType = 'empty';
        }
        this.service.setPayoutMessage(data?.data);
        this.loadingPayouts = false;
      },
      () => {
        this.authService.checkExpired();
        this.payouts = undefined;
        this.loadingPayouts = false;
      }
    );
  }

  onSubmit() {
    this.onValueChanged();
    const feed = this.feedbackFormDirective.invalid;
    if (feed) {
    } else {
      this.savingPayout = true;
      this.httpService
        .postData(baseUrl.bank, {
          account_number: this.accountDetails?.account_number,
          account_name: this.accountDetails?.account_name,
          bank_code: this.feedbackForm.value.bankName?.code,
          bank_name: this.feedbackForm.value.bankName?.name,
          provider: this.feedbackForm.value.bankName?.provider,
        })
        .subscribe(
          (data: any) => {
            this.openDialog({
              message: 'Successfully added payout',
              requestType: 'success-error',
              requestMessage: '',
            });
            this.actionType = 'save';
            this.savingPayout = false;
            this.feedbackFormDirective.resetForm();
            this.getPayouts();
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
                duration: 3000,
                panelClass: 'error',
                horizontalPosition: 'center',
                verticalPosition: 'top',
              }
            );
            this.savingPayout = false;
            this.authService.checkExpired();
          }
        );
    }
  }

  openDialog(data: any, type?: string) {
    this.dialog.closeAll();
    this.dialog.open(DialogComponent, {
      data: {
        type: type || 'dialog',
        data: data,
      },
    });
  }

  autoFIllBankList() {
    this.filteredOptions = this.feedbackForm.get('bankName').valueChanges.pipe(
      startWith(''),
      map((value: any) => {
        const name = typeof value === 'string' ? value : value?.name;
        return name
          ? this._filter(name as string)
          : this.options?.slice() || name;
      })
    );
  }

  ngOnInit() {
    this.autoFIllBankList();
  }

  changeActive(type: string) {
    this.actionType = type;
  }

  changeActiveCard(data: any) {
    if (this.updatePayoutSubscription) {
      this.updatePayoutSubscription.unsubscribe();
    }
    this.updatingPayout = data?.uuid;
    this.updatePayoutSubscription = this.httpService
      .updateData(baseUrl.bank + `/${data?.uuid}`, {
        is_default: true,
      })
      .subscribe(
        (data: any) => {
          this.snackBar.open('Successfully set payout as default', 'x', {
            duration: 3000,
            panelClass: 'success',
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          this.getPayouts();
          this.updatingPayout = undefined;
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
          this.updatingPayout = undefined;
          this.authService.checkExpired();
        }
      );
  }

  deleteCard(data: any) {
    if (this.deletePayoutSubscription) {
      this.deletePayoutSubscription.unsubscribe();
    }
    this.deletingPayout = data?.uuid;
    this.deletePayoutSubscription = this.httpService
      .deleteData(baseUrl.bank, `/${data?.uuid}`)
      .subscribe(
        (data: any) => {
          this.snackBar.open('Successfully deleted payout', 'x', {
            duration: 3000,
            panelClass: 'success',
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          this.getPayouts();
          this.deletingPayout = undefined;
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
          this.deletingPayout = undefined;
          this.authService.checkExpired();
        }
      );
  }

  displayFn(banks: any): string {
    return banks && banks.name ? banks.name : '';
  }

  private _filter(name: string) {
    const filterValue = name.toLowerCase();

    return this.options.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  fetchAccountDetails() {
    if (
      this.accountDetails?.account_number !==
        this.feedbackForm.value.accountNumber &&
      this.feedbackForm.value.accountNumber?.length === 10 &&
      this.feedbackForm.value.bankName?.code !== undefined
    ) {
      this.fetchingDetails = true;
      this.httpService
        .postData(baseUrl.bankList, {
          account_number: this.feedbackForm?.value?.accountNumber,
          bank_code: this.feedbackForm?.value?.bankName?.code,
        })
        .subscribe(
          (data: any) => {
            this.accountDetails = data?.data?.data;
            this.feedbackForm.patchValue({
              accountName: data?.data?.data?.account_name,
            });
            this.accountDetailsError = '';
            this.fetchingDetails = false;
          },
          (err) => {
            this.accountDetailsError =
              err?.error?.msg ||
              err?.error?.detail ||
              err?.error?.status ||
              'Unable to fetch account details';

            this.snackBar.open(
              err?.error?.msg ||
                err?.error?.detail ||
                err?.error?.status ||
                'Unable to fetch account details',
              'x',
              {
                duration: 5000,
                panelClass: 'error',
                horizontalPosition: 'center',
                verticalPosition: 'top',
              }
            );

            this.fetchingDetails = false;
          }
        );
    }
  }

  cancel() {
    this.actionType = 'save';
    if (this.httpSubscription) {
      this.httpSubscription.unsubscribe();
    }
  }

  initiatePayout(): void {
    let activeAccount = this.payouts.find((n: any) => n?.is_default === 1);
    this.openDialog(activeAccount, 'payout');
  }
}
