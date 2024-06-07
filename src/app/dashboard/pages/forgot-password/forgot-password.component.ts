import { CommonModule, Location, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Subscription } from 'rxjs';
import { VerifyEmailFormComponent } from '../../components/email-verification-component/verify-email-form/verify-email-form.component';
import { VerifyEmailSuccessErrorComponent } from '../../components/email-verification-component/verify-email-success-error/verify-email-success-error.component';
import { VerifyEmailComponent } from '../../components/email-verification-component/verify-email/verify-email.component';
import { ForgotPasswordRequestVerificationComponent } from '../../components/forgot-password-component/forgot-password-request-verification/forgot-password-request-verification.component';
import { ForgotPasswordSetNewComponent } from '../../components/forgot-password-component/forgot-password-set-new/forgot-password-set-new.component';
import { ToggleNavService } from '../../dashboard-service/toggle-nav.service';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    VerifyEmailComponent,
    VerifyEmailFormComponent,
    VerifyEmailSuccessErrorComponent,
    ForgotPasswordRequestVerificationComponent,
    ForgotPasswordSetNewComponent,
    HeaderComponent,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  requestType: string = 'request-password';
  data: any;
  clickEventSubscription?: Subscription;

  constructor(
    private service: ToggleNavService,
    private location: Location,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.service.getClickEvent().subscribe((data: any) => {
      if (data) {
        this.requestType = data?.requestType;
        this.data = data;
      } else {
        if (isPlatformBrowser(this.platformId)) {
          this.location.back();
        }
      }
    });

    this.clickEventSubscription = this.service
      .getClickEvent()
      .subscribe((data: any) => {
        this.requestType = data?.requestType;
        this.data = data;
      });
  }
}
