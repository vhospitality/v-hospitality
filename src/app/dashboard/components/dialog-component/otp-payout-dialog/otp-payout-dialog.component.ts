import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { baseUrl } from '../../../../../environments/environment';
import { AuthService } from '../../../../global-services/auth.service';
import { HttpService } from '../../../../global-services/http.service';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';
import { CodeInputComponent } from '../../code-input/code-input.component';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-otp-payout-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterModule, CodeInputComponent],
  templateUrl: './otp-payout-dialog.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./otp-payout-dialog.component.scss'],
})
export class OtpPayoutDialogComponent {
  @Input() payout: any;
  resendLoading: boolean = false;
  code?: string;
  loading: boolean = false;
  userData: any = this.service.getProfileMessage();

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private httpService: HttpService,
    private snackBar: MatSnackBar,
    private service: ToggleNavService
  ) {
    this.authService.checkExpired();
  }

  ngOnInit(): void {}

  // this called only if user entered full code
  onCodeCompleted(code: string) {
    this.code = code;
  }

  onSubmit() {
    if (this.code?.length == 4) {
      this.loading = true;

      this.httpService
        .postData(baseUrl.withdraws, {
          amount:
            this.calculateTransferFee(this.payout?.formData?.amount) +
            this.payout?.formData?.amount,
          code: this.code,
          bank: this.payout?.accountData?.bank_name,
        })
        .subscribe(
          () => {
            this.loading = false;

            let naira = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'NGN',
            });

            this.service.setProfileMessage(undefined);
            this.service.profileMessage = undefined;
            this.service.sendIsLoginClickEvent();

            this.openDialog2(
              {
                message: `You have been payed the sum of ${naira.format(
                  this.payout?.formData?.amount
                )} from your total earnings.`,
                requestType: 'success-error',
                title: 'Payout Successful!',
                requestMessage: '',
              },
              'dialog'
            );
          },
          (err) => {
            this.loading = false;
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

  resendOtp() {
    this.resendLoading = true;
    this.httpService.postData(baseUrl.otp, {}).subscribe(
      (data: any) => {
        this.resendLoading = false;

        this.snackBar.open(
          data?.message || data?.msg || data?.detail || 'Otp sent!',
          'x',
          {
            duration: 3000,
            panelClass: 'success',
            horizontalPosition: 'center',
            verticalPosition: 'top',
          }
        );
      },
      (err) => {
        this.resendLoading = false;
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
        this.authService.checkExpired();
      }
    );
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  openDialog2(data: any, type: string) {
    this.dialog.closeAll();
    this.dialog.open(DialogComponent, {
      data: {
        type: type,
        data: data,
      },
    });
  }

  openDialog(data: any, type: string) {
    this.dialog.closeAll();
    this.dialog.open(DialogComponent, {
      data: {
        type: type,
        data: { data, amount: this.payout?.formData?.amount },
      },
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
}
