import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { baseUrl } from '../../../../../environments/environment';
import { HttpService } from '../../../../global-services/http.service';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';
import { CodeInputComponent } from '../../code-input/code-input.component';

@Component({
  selector: 'app-verify-email-form',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterModule, CodeInputComponent],
  templateUrl: './verify-email-form.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./verify-email-form.component.scss'],
})
export class VerifyEmailFormComponent implements OnInit {
  @Input() data: any;
  resendLoading: boolean = false;
  code?: string;
  loading: boolean = false;

  constructor(
    private service: ToggleNavService,
    private httpService: HttpService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  // this called only if user entered full code
  onCodeCompleted(code: string) {
    this.code = code;
  }

  onSubmit() {
    if (this.code?.length == 4) {
      this.loading = true;

      this.httpService
        .postData(baseUrl.passwordVerification, {
          receiver: this.data?.email,
          code: this.code,
          type: this.data?.isEmail ? 'email' : 'phone',
        })
        .subscribe(
          () => {
            this.loading = false;

            this.service.sendClickEvent({
              requestType: this.data?.password
                ? 'set-new-password'
                : 'success-error',
              password: true,
              email: this.data.email,
              isEmail: this.data?.isEmail,
            });
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
  }

  resendOtp() {
    this.resendLoading = true;
    this.httpService
      .postData(
        baseUrl.requestResetPassword,
        this.data?.isEmail
          ? { email: this.data?.email, type: 'email' }
          : { phone: this.data?.email, type: 'phone' }
      )
      .subscribe(
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
        }
      );
  }
}
