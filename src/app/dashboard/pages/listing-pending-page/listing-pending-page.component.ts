import { CommonModule } from '@angular/common';
import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { baseUrl } from '../../../../environments/environment';
import { AuthService } from '../../../global-services/auth.service';
import { HttpService } from '../../../global-services/http.service';
import { ToggleNavService } from '../../dashboard-service/toggle-nav.service';
import { AccommodationBookingComponent } from '../accommodation-booking/accommodation-booking.component';

@Component({
  selector: 'app-listing-pending-page',
  standalone: true,
  imports: [CommonModule, AccommodationBookingComponent],
  templateUrl: './listing-pending-page.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./listing-pending-page.component.scss'],
})
export class ListingPendingPageComponent implements OnDestroy {
  data: any;

  constructor(
    private service: ToggleNavService,
    private authService: AuthService,
    private httpService: HttpService,
    private router: Router
  ) {
    let data: any = this.service.getPropertyMessage();
    this.data = data;
    if (!data) {
      this.router.navigate(['/host-listing']);
    }
    this.getProfileDetails();
  }

  getProfileDetails() {
    setTimeout(() => {
      this.httpService.getAuthSingle(baseUrl.profileDetails).subscribe(
        (data: any) => {
          this.service.setProfileMessage(data?.data);
          this.service.sendIsLoginClickEvent();
        },
        () => {
          this.authService.checkExpired();
        }
      );
    }, 3000);
  }

  ngOnDestroy(): void {
    this.service.setAccommodationMessage(undefined);
    this.service.setPropertyMessage(undefined);
    this.service.accommodationMessage = undefined;
    this.service.propertyMessage = undefined;
    this.router.navigate(['/host-listing']);
  }
}
