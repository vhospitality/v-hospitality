import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  Input,
  PLATFORM_ID,
  ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { Subject } from 'rxjs';
import { baseUrl } from '../../../../../environments/environment';
import { AuthService } from '../../../../global-services/auth.service';
import { HttpService } from '../../../../global-services/http.service';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';
import { DialogComponent } from '../../dialog/dialog.component';
import { NoDataMessageComponent } from '../../no-data-message/no-data-message.component';

@Component({
  selector: 'app-pay-with-card-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    NoDataMessageComponent,
    SkeletonModule,
  ],
  templateUrl: './pay-with-card-dialog.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./pay-with-card-dialog.component.scss'],
})
export class PayWithCardDialogComponent {
  @Input() card: any;
  cards: any;
  loading: boolean = false;
  loadingCards: boolean = false;
  disabled: boolean = false;
  errorMessage: string = 'No payment cards found.';
  activeCard: any;
  serviceData: any = {};
  public name = new Subject<any>();
  userData: any = this.service.getProfileMessage();

  constructor(
    private dialog: MatDialog,
    private service: ToggleNavService,
    private authService: AuthService,
    private httpService: HttpService,
    private snackBar: MatSnackBar,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    let cards: any = this.service.getCardsMessage();
    if (cards) {
      this.cards = cards;
    } else {
      this.getAvailableCards();
    }
    this.authService.checkExpired();
  }

  payWithPaystack() {
    this.service.setAccommodationMessage(undefined);
    this.service.setPropertyMessage(undefined);
    this.service.accommodationMessage = undefined;
    this.service.propertyMessage = undefined;

    this.snackBar.open('Redirecting to payment page, please wait!', 'x', {
      duration: 10000,
      panelClass: 'success',
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });

    if (isPlatformBrowser(this.platformId)) {
      window.location.href =
        this.card?.payment_url ||
        this.card?.listing?.payment_url ||
        this.card?.url ||
        this.card?.data?.url ||
        this.card?.data;
    }
  }

  getTotalGuest() {
    return (
      this.card?.guests?.adults +
      this.card?.guests?.children +
      this.card?.guests?.infants
    );
  }

  onSubmit() {
    if (!this.activeCard) {
      this.snackBar.open('Please select card!', 'x', {
        duration: 5000,
        panelClass: 'error',
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    } else {
      this.loading = true;
      this.disabled = true;

      this.httpService
        .postData(baseUrl.cards + `/${this.activeCard?.uuid}/charge`, {
          amount: this.card?.total * 100 || this.card?.price * 100,
          reference:
            this.card?.payment_reference ||
            this.card?.data?.reference ||
            this.card?.reference,
          metadata:
            this.card?.type == 'booking'
              ? {
                  listing_uuid:
                    this.card?.listing_uuid || this.card?.listing?.uuid,
                  check_in: this.card?.check_in,
                  check_out: this.card?.check_out,
                  no_of_guests: this.card?.no_of_guests || this.getTotalGuest(),
                  uuid: this.userData?.uuid,
                  guests: this.card?.guests,
                  reference: this.card?.payment_reference,
                  type: 'booking',
                }
              : {
                  subscription_uuid: this.card?.uuid,
                  uuid: this.userData?.uuid,
                  type: 'subscription',
                  reference: this.card?.data?.reference,
                },
        })
        .subscribe(
          (data: any) => {
            this.loading = false;
            this.disabled = false;

            this.snackBar.open('Card has been charged successfully', 'x', {
              duration: 5000,
              panelClass: 'success',
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });

            if (this.card?.type == 'booking') {
              this.service.setAccommodationMessage(undefined);
              this.service.setPropertyMessage(undefined);
              this.service.accommodationMessage = undefined;
              this.service.propertyMessage = undefined;
              setTimeout(() => {
                this.router.navigate(['/bookings']);
              }, 3000);
            } else {
              this.service.sendReloadSubscriptionClickEvent();
            }
            this.closeDialog();
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

  getAvailableCards() {
    this.loadingCards = true;

    this.httpService.getAuthSingle(baseUrl.cards).subscribe(
      (data: any) => {
        this.cards = data?.data;
        this.loadingCards = false;
        this.service.setCardsMessage(data?.data);
      },
      () => {
        this.loadingCards = false;
      }
    );
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  removeWhiteSpace(name: any) {
    return name.replaceAll(/\s/g, '');
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
