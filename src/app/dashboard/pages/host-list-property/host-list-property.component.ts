import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { SkeletonModule } from 'primeng/skeleton';
import { Subscription } from 'rxjs';
import { SeoService } from 'src/app/global-services/seo.service';
import { baseUrl } from '../../../../environments/environment';
import { AuthService } from '../../../global-services/auth.service';
import { HttpService } from '../../../global-services/http.service';
import { BackButtonComponent } from '../../components/back-button/back-button.component';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { NoDataMessageComponent } from '../../components/no-data-message/no-data-message.component';
import { ToggleNavService } from '../../dashboard-service/toggle-nav.service';
import { EscapeHtmlPipe } from '../../pipes/escape-html.pipe';

@Component({
  selector: 'app-host-list-property',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    HeaderComponent,
    FooterComponent,
    AccordionModule,
    SkeletonModule,
    EscapeHtmlPipe,
    NoDataMessageComponent,
    BackButtonComponent,
    RouterModule,
  ],
  templateUrl: './host-list-property.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./host-list-property.component.scss'],
})
export class HostListPropertyComponent {
  activeBilling: string = 'monthly';
  subscriptions: any[] = [];
  monthlySubscriptions: any[] = [];
  yearlySubscriptions: any[] = [];
  faqs: any[] = [];
  loadingfaq: boolean = false;
  loaderSubscription: any[] = [1, 2];
  userData: any;
  clickEventSubscription?: Subscription;
  clickEventSubscription2?: Subscription;
  subType: any = '';
  errorMessage: string =
    "Coming Soon, we're working on something awesome. Stay tuned!";
  loading: string = '';
  popupcount: boolean = false;

  feature1: any[] = [
    { name: 'Receive access to ratings' },
    { name: 'Enjoy 24/7 support' },
    { name: 'Enjoy priority placement in search results' },
    { name: 'Access to exclusive hosting resources to help you succeed.' },
    { name: 'Special promotional and partnership opportunities.' },
    { name: 'Priority customer support' },
    { name: 'Advanced analytics to optimize your listings' },
    { name: 'Exclusive marketing campaigns' },
    { name: '13 month subscription' },
  ];

  feature2: any[] = [
    { name: 'Means of Identification.' },
    {
      name: 'Utility Bill - Any of the following:',
      sub: [
        { name: 'Ground rent.' },
        { name: 'Electricity Bill.' },
        { name: 'Environment Bill.' },
        { name: 'Water Bill.' },
      ],
    },
  ];

  feature3: any[] = [
    { name: 'Basic-boost' },
    { name: 'Premium-professional' },
    { name: 'Ultimate-portfolio' },
    { name: 'Supreme-portfolio' },
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog,
    private httpService: HttpService,
    private service: ToggleNavService,
    private direct: ActivatedRoute,
    private snackBar: MatSnackBar,
    private seo: SeoService
  ) {
    this.seo.updateSeoTags({
      title: 'Pricing' + ' - ' + baseUrl.feDomain,
    });

    let subscriptions: any = this.service.getSubscriptionsMessage();
    this.userData = this.service.getProfileMessage();

    this.direct.paramMap.subscribe((params) => {
      this.subType = params.get('id');
    });

    this.direct.queryParamMap.subscribe((params: any) => {
      if (params?.params?.trxref || params?.params?.reference) {
        this.openDialog(
          {
            reference: params?.params?.trxref || params?.params?.reference,
            message:
              'You have just made a payment, would you like to save card for subsequent payments?',
            requestType: 'success-error',
            title: 'Save card details',
            requestMessage: '',
            type: 'card',
          },
          'dialog'
        );
      }
    });

    if (this.subType == 'subscription') {
      // subscription
      if (subscriptions && this.userData) {
        this.setupData(subscriptions);
      } else {
        if (this.userData) {
          this.monthlySubscriptions = [];
          this.yearlySubscriptions = [];
          this.getSubscriptions();
        }
      }
    }

    // faqs
    let faqs: any = this.service.getFaqsMessage();
    if (faqs) {
      this.faqs = faqs;
    } else {
      this.getfaqs();
    }

    this.clickEventSubscription = this.service
      .getIsLoginClickEvent()
      .subscribe(() => {
        this.userData = this.service.getProfileMessage();
        if (this.subType == 'subscription') {
          this.getSubscriptions();
        }
      });

    this.clickEventSubscription2 = this.service
      .getReloadSubscriptionClickEvent()
      .subscribe(() => {
        this.reloadSubscription();
      });

    if (
      this.userData?.subscription?.subscription_type?.toLowerCase() ===
      'freemium'
    ) {
      this.dialog.open(DialogComponent, {
        data: {
          type: 'dialog',
          data: {
            requestType: 'upgrade-plan',
            requestMessage: 'You are currently using freemium plan',
            data: '',
          },
        },
      });

      this.popupcount = true;
    }
  }

  reloadSubscription() {
    this.subscriptions = [];
    this.monthlySubscriptions = [];
    this.yearlySubscriptions = [];
    this.loaderSubscription = [1, 2];

    setTimeout(() => {
      this.router.navigate(['/host-listing']);
      this.snackBar.open('Successfully subscribed', 'x', {
        duration: 3000,
        panelClass: 'success',
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }, 5000);
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

  getTransactionReference() {
    return 'VHS' + Math.ceil(Math.random() * 10e13);
  }

  setupData(data: any) {
    this.monthlySubscriptions = data?.data.filter((name: any) => {
      return (
        (name?.type == 'monthly' || name?.type == 'forever') &&
        name?.is_active == 1
      );
    });

    this.yearlySubscriptions = data?.data.filter((name: any) => {
      return name?.type == 'annual' && name?.is_active == 1;
    });

    if (this.activeBilling == 'monthly') {
      this.subscriptions = this.monthlySubscriptions;
    } else {
      this.subscriptions = this.yearlySubscriptions;
    }

    this.loaderSubscription = [];
  }

  getSubscriptions() {
    this.subscriptions = [];
    this.monthlySubscriptions = [];
    this.yearlySubscriptions = [];
    this.loaderSubscription = [1, 2];

    this.httpService.getSingleNoAuth(baseUrl.subscriptions).subscribe(
      (data: any) => {
        data?.data?.sort((a: any, b: any) => a.price - b.price);

        // get user details if user is loggedin
        if (this.authService.isLoggedIn()) {
          this.httpService.getAuthSingle(baseUrl.profileDetails).subscribe(
            (user: any) => {
              this.userData = user?.data;
              this.setupData(data);
              this.service.setProfileMessage(user?.data);
              this.service.setSubscriptionsMessage(data);
              // this.service.sendIsLoginClickEvent();
            },
            () => {
              this.setupData(data);
              this.service.setSubscriptionsMessage(data);
            }
          );
        } else {
          this.setupData(data);
          this.service.setSubscriptionsMessage(data);
        }
      },
      (err) => {
        this.loaderSubscription = [];
      }
    );
  }

  getfaqs() {
    this.loadingfaq = true;
    this.httpService.getSingleNoAuth(baseUrl.faqs).subscribe(
      (data: any) => {
        this.faqs = data?.data.filter((name: any) => {
          return name?.is_active == 1;
        });

        this.loadingfaq = false;
        this.service.setFaqsMessage(this.faqs);
      },
      (err) => {
        this.loadingfaq = false;
      }
    );
  }

  changeActiveBilling(type: string) {
    if (type == 'monthly') {
      this.subscriptions = this.monthlySubscriptions;
    } else {
      this.subscriptions = this.yearlySubscriptions;
    }
    this.activeBilling = type;
  }

  startProcess(uuid: string, sub?: any) {
    if (
      this.authService.isLoggedIn() &&
      this.userData?.subscription?.subscription == uuid &&
      this.userData?.subscription?.is_active == 1
    ) {
      this.service.setAccommodationMessage(undefined);
      this.service.setPropertyMessage(undefined);
      this.router.navigate(['/property-signup']);
    } else if (!this.authService.isLoggedIn()) {
      this.openDialog('', 'login2');
    } else {
      this.createSubscruption(sub);
    }
  }

  createSubscruption(sub: any) {
    this.loading = sub?.uuid;
    const saveSubscriptions = this.subscriptions;

    this.httpService
      .postData(baseUrl.free_subscription + `/${sub?.uuid}`, {})
      .subscribe(
        (data: any) => {
          if (sub?.price <= 0) {
            this.snackBar.open(
              data?.message || 'Successfully subscribed to free plan',
              'x',
              {
                duration: 3000,
                panelClass: 'success',
                horizontalPosition: 'center',
                verticalPosition: 'top',
              }
            );
            this.reloadSubscription();
          } else {
            data.type = 'subscription';
            Object.assign(data, sub);
            this.openDialog(data, 'card');
          }
          this.loading = '';
        },
        (err) => {
          this.loading = '';
          this.setupData({ data: saveSubscriptions });

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
        }
      );
  }

  createListing() {
    if (this.authService.isLoggedIn()) {
      this.service.setAccommodationMessage(undefined);
      this.service.setPropertyMessage(undefined);
      this.service.accommodationMessage = undefined;
      this.service.propertyMessage = undefined;
      this.router.navigate(['/property-signup']);
    } else {
      this.openDialog('', 'login2');
    }
  }
}
