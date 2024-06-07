import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Subscription } from 'rxjs';
import { baseUrl } from '../../../../../environments/environment';
import { AuthService } from '../../../../global-services/auth.service';
import { HttpService } from '../../../../global-services/http.service';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';

@Component({
  selector: 'app-how-guest-book',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule, MatProgressSpinnerModule],
  templateUrl: './how-guest-book.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./how-guest-book.component.scss'],
})
export class HowGuestBookComponent {
  @Input() componentData: any;
  book: boolean = true;
  verification: boolean = false;
  error: string = '';
  loading: boolean = false;

  clickEventSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private service: ToggleNavService,
    private httpService: HttpService
  ) {
    this.authService.checkExpired();

    this.clickEventSubscription = this.service
      .getPropertyClickEvent()
      .subscribe((data: any) => {
        this.add(data);
      });

    let data: any = this.service.getPropertyMessage();

    this.book = data?.guestBook;
    this.verification = data?.has_advance_verification;
  }

  toggleVerification() {
    this.verification = !this.verification;
    if (this.verification) {
      this.book = false;
    } else {
      this.book = true;
    }
  }

  toggleBook() {
    this.book = !this.book;
    if (this.book) {
      this.verification = false;
    } else {
      this.verification = true;
    }
  }

  add(type: any) {
    if (type?.componentNumber == 6) {
      this.updateData(type);
    }
  }

  updateData(type: any) {
    this.loading = true;

    let data: any = this.service.getPropertyMessage();

    this.httpService
      .updateData(
        data?.id
          ? baseUrl.draft + '/' + data?.id
          : baseUrl.listing + '/' + data?.uuid,
        {
          is_instant_bookable: this.book,
          has_advance_verification: this.verification,
          step: 6,
        }
      )
      .subscribe(
        () => {
          this.loading = false;
          let data: any = this.service.getPropertyMessage();
          Object.assign(data, {
            guestBook: this.book,
            has_advance_verification: this.verification,
          });

          this.service.setPropertyMessage(data);
          this.service.sendSubmitPropertyClickEvent({
            type: type?.type,
            componentNumber: 6,
          });
        },
        (err) => {
          this.loading = false;
          this.error =
            err?.error?.message ||
            err?.error?.msg ||
            err?.error?.detail ||
            'An error occured, please try again';

          this.service.sendSubmitPropertyClickEvent({
            type: 'error',
          });
        }
      );
  }
}
