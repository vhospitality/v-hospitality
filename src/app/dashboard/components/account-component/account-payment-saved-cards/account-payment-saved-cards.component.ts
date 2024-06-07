import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SkeletonModule } from 'primeng/skeleton';
import { baseUrl } from '../../../../../environments/environment';
import { AuthService } from '../../../../global-services/auth.service';
import { HttpService } from '../../../../global-services/http.service';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';
import { NoDataMessageComponent } from '../../no-data-message/no-data-message.component';

@Component({
  selector: 'app-account-payment-saved-cards',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    SkeletonModule,
    NoDataMessageComponent,
  ],
  templateUrl: './account-payment-saved-cards.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./account-payment-saved-cards.component.scss'],
})
export class AccountPaymentSavedCardsComponent {
  @Input() userData: any;
  cards: any;
  loading: boolean = false;
  deletingCards: string = '';
  errorMessage: string = 'No payment cards found.';
  httpSubscription: any;

  constructor(
    private authService: AuthService,
    private service: ToggleNavService,
    private httpService: HttpService,
    private snackBar: MatSnackBar
  ) {
    let cards: any = this.service.getCardsMessage();

    if (cards) {
      this.cards = cards;
    } else {
      this.getAvailableCards();
    }

    this.authService.checkExpired();
  }

  getAvailableCards() {
    this.loading = true;
    this.httpService.getAuthSingle(baseUrl.cards).subscribe(
      (data: any) => {
        this.cards = data?.data;
        this.service.setCardsMessage(data?.data);
        this.loading = false;
      },
      () => {
        this.authService.checkExpired();
        this.loading = false;
      }
    );
  }

  deleteCard(data2: any) {
    if (this.httpSubscription) {
      this.httpSubscription.unsubscribe();
    }

    this.deletingCards = data2?.uuid;

    this.httpSubscription = this.httpService
      .deleteData(baseUrl.cards, `/${data2?.uuid}`)
      .subscribe(
        (data: any) => {
          this.snackBar.open(
            `Successfully deleted ${data2?.bank || 'card'}`,
            'x',
            {
              duration: 3000,
              panelClass: 'success',
              horizontalPosition: 'center',
              verticalPosition: 'top',
            }
          );
          this.getAvailableCards();
          this.deletingCards = '';
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
          this.deletingCards = '';
          this.authService.checkExpired();
        }
      );
  }

  removeWhiteSpace(name: any) {
    return name.replaceAll(/\s/g, '');
  }
}
