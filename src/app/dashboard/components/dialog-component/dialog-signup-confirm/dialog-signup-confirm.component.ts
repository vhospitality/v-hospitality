import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { baseUrl } from '../../../../../environments/environment';
import { HttpService } from '../../../../global-services/http.service';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';
import { CodeInputComponent } from '../../code-input/code-input.component';

@Component({
  selector: 'app-dialog-signup-confirm',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CodeInputComponent,
  ],
  templateUrl: './dialog-signup-confirm.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./dialog-signup-confirm.component.scss'],
})
export class DialogSignupConfirmComponent {
  @Input() data: any;
  code: string = '';
  loading: boolean = false;
  disabled: boolean = false;
  resendLoading: boolean = false;
  minutes: number = 0;
  seconds: number = 0;

  constructor(
    private service: ToggleNavService,
    private dialog: MatDialog,
    private httpService: HttpService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.countdown(1200);
  }

  // this called only if user entered full code
  onCodeCompleted(code: string) {
    this.code = code;
  }

  onSubmit() {
    if (this.code?.length == 4) {
      this.loading = true;

      this.httpService
        .postData(baseUrl.signupVerifyOtp, {
          receiver: this.data?.email,
          code: this.code,
          type: this.data?.isEmail ? 'email' : 'phone',
        })
        .subscribe(
          () => {
            this.loading = false;

            this.service.sendSignupClickEvent({
              requestType: 'details',
              requestMessage: 'Add your details',
              email: this.data?.email,
              code: this.code,
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
        baseUrl.signupRequestVerification,
        this.data?.isEmail
          ? { email: this.data?.email, type: 'email' }
          : { phone: this.data?.email, type: 'phone' }
      )
      .subscribe(
        (data: any) => {
          this.resendLoading = false;

          this.minutes = 0;
          this.seconds = 0;
          this.countdown(120);

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

  countdown(remaining: number) {
    let m: any = Math.floor(remaining / 60);
    let s: any = remaining % 60;

    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;

    this.minutes = m;
    this.seconds = s;

    remaining -= 1;

    if (remaining >= 0) {
      setTimeout(() => {
        this.countdown(remaining);
      }, 1000);
    }
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
