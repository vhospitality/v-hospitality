import { CommonModule, Location, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  PLATFORM_ID,
  ViewEncapsulation,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { VerifyEmailFormComponent } from '../../components/email-verification-component/verify-email-form/verify-email-form.component';
import { VerifyEmailSuccessErrorComponent } from '../../components/email-verification-component/verify-email-success-error/verify-email-success-error.component';
import { VerifyEmailComponent } from '../../components/email-verification-component/verify-email/verify-email.component';
import { ToggleNavService } from '../../dashboard-service/toggle-nav.service';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [
    CommonModule,
    VerifyEmailComponent,
    VerifyEmailFormComponent,
    VerifyEmailSuccessErrorComponent,
    HeaderComponent,
  ],
  templateUrl: './email-verification.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./email-verification.component.scss'],
})
export class EmailVerificationComponent {
  requestType: string = 'default';
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
