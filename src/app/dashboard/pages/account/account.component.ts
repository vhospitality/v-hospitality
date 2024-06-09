import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  PLATFORM_ID,
  ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { baseUrl } from '../../../../environments/environment';
import { AuthService } from '../../../global-services/auth.service';
import { HttpService } from '../../../global-services/http.service';
import { AccountNotificationComponent } from '../../components/account-component/account-notification/account-notification.component';
import { AccountPaymentComponent } from '../../components/account-component/account-payment/account-payment.component';
import { AccountPayoutComponent } from '../../components/account-component/account-payout/account-payout.component';
import { AccountProfileComponent } from '../../components/account-component/account-profile/account-profile.component';
import { BackButtonComponent } from '../../components/back-button/back-button.component';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { ToggleNavService } from '../../dashboard-service/toggle-nav.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    AccountProfileComponent,
    AccountPaymentComponent,
    AccountNotificationComponent,
    HeaderComponent,
    FooterComponent,
    AccountPayoutComponent,
    BackButtonComponent,
  ],
  templateUrl: './account.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements AfterViewInit {
  currentType: string = 'profile';
  userData: any;
  roles: any[] = [];
  switchGuest: boolean = false;
  clickEventSubscription?: Subscription;

  constructor(
    private direct: ActivatedRoute,
    private authService: AuthService,
    private service: ToggleNavService,
    private httpService: HttpService,
    public dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.userData = this.service.getProfileMessage();

    if (!this.userData) {
      this.getProfileDetails();
    } else {
      for (let r of this.userData?.roles) {
        this.roles.push(r?.name?.toLowerCase());
      }
    }

    this.direct.paramMap.subscribe((params) => {
      switch (params.get('id')) {
        case 'profile':
          this.currentType = 'profile';
          break;
        case 'notification':
          this.currentType = 'notification';
          break;
        case 'payment':
          this.currentType = 'payment';
          break;
        case 'payout':
          this.currentType = 'payout';
          break;
        default:
          this.currentType = 'profile';
          break;
      }
    });

    this.clickEventSubscription = this.service
      .getIsLoginClickEvent()
      .subscribe(() => {
        this.userData = this.service.getProfileMessage();
        this.checkIfHostOrGuest();
      });

    this.checkIfHostOrGuest();
  }

  getProfileDetails() {
    this.httpService.getAuthSingle(baseUrl.profileDetails).subscribe(
      (data: any) => {
        this.userData = data?.data;

        for (let r of this.userData?.roles) {
          this.roles.push(r?.name?.toLowerCase());
        }

        this.service.setProfileMessage(data?.data);
      },
      () => {
        this.authService.checkExpired();
      }
    );
  }

  checkIfHostOrGuest() {
    if (isPlatformBrowser(this.platformId)) {
      if (localStorage.getItem('CURRENT_USER_TYPE') === null) {
        this.switchGuest = false;
      } else {
        let switchGuest = localStorage.getItem('CURRENT_USER_TYPE') as any;
        if (switchGuest === 'true') {
          this.switchGuest = true;
        } else {
          this.switchGuest = false;
        }
      }
    }
  }

  changeType(type: string) {
    this.currentType = type;
  }

  openDialog(type: string, data: any) {
    this.dialog.closeAll();
    this.dialog.open(DialogComponent, {
      data: {
        type: type,
        data: {
          requestType: 'upload',
          requestMessage: 'Please verify your identity',
          data: data,
        },
      },
    });
  }

  ngAfterViewInit(): void {
    this.authService.checkExpired();
  }
}
