import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { SkeletonModule } from 'primeng/skeleton';
import { Subscription } from 'rxjs';
import { ToggleNavService } from 'src/app/dashboard/dashboard-service/toggle-nav.service';
import { baseUrl } from '../../../../../environments/environment';
import { AuthService } from '../../../../global-services/auth.service';
import { ChatService } from '../../../../global-services/chat.service';
import { HttpService } from '../../../../global-services/http.service';

@Component({
  selector: 'app-chat-right-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LazyLoadImageModule, SkeletonModule],
  templateUrl: './chat-right-sidebar.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./chat-right-sidebar.component.scss'],
})
export class ChatRightSidebarComponent {
  @Input() listingDetails: any;
  defaultImage: string = baseUrl.defaultImage;
  loading: boolean = false;
  data: any;
  clickEventSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private httpService: HttpService,
    private chatService: ChatService,
    private service: ToggleNavService
  ) {
    this.authService.checkExpired();

    this.clickEventSubscription = this.service
      .getIsFoundListingClickEvent()
      .subscribe((data: any) => {
        if (data?.listing) {
          this.getBookingDetails(data?.listing?.listing || data?.listing);
        }
      });
  }

  totalGuest() {
    return (
      this.listingDetails?.guests?.adults +
      this.listingDetails?.guests?.children +
      this.listingDetails?.guests?.infants
    );
  }

  totalBathroom() {
    return (
      this.listingDetails?.listing?.no_of_dedicated_bathroom +
      this.listingDetails?.listing?.no_of_private_bathroom +
      this.listingDetails?.listing?.no_of_shared_bathroom
    );
  }

  getBookingDetails(id: string) {
    this.httpService
      .getAuthSingle(
        baseUrl.bookings +
          `/${id}/?include=listing,user&fields[user]=first_name,last_name,uuid&fields[listing.host]=first_name,last_name,uuid,pictures&fields[bookings]=uuid,booking_code,reason_for_decline,check_in,check_out,status,payment_status,guests,created_at&fields[listing]=uuid,reviews_score,reviews_count,pictures,collection_id,type,no_of_guests,no_of_bedrooms,no_of_beds,no_of_private_bathroom,no_of_dedicated_bathroom,no_of_shared_bathroom,street_address,apt_suite,city,state,zipcode,country,longitude,latitude,title,description,is_instant_bookable,minimum_nights,maximum_nights,check_in,check_out,available_from,available_to,price_per_night,occupancy_taxes,status,amenities,house_rules,created_at`
      )
      .subscribe(
        (data: any) => {
          this.listingDetails = data?.data;
        },
        () => {
          this.listingDetails = undefined;
        }
      );
  }

  ngOnInit(): void {
    this.chatService.getMessage().subscribe((data) => {
      if (data?.listing) {
        this.getBookingDetails(data?.listing);
      }
    });
  }
}
