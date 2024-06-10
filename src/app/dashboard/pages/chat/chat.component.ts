import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { baseUrl } from '../../../../environments/environment';
import { AuthService } from '../../../global-services/auth.service';
import { HttpService } from '../../../global-services/http.service';
import { ChatContentComponent } from '../../components/chat-component/chat-content/chat-content.component';
import { ChatLeftSidebarComponent } from '../../components/chat-component/chat-left-sidebar/chat-left-sidebar.component';
import { ChatRightSidebarComponent } from '../../components/chat-component/chat-right-sidebar/chat-right-sidebar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { ToggleNavService } from '../../dashboard-service/toggle-nav.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    ChatContentComponent,
    ChatLeftSidebarComponent,
    ChatRightSidebarComponent,
    HeaderComponent,
    MatButtonModule,
  ],
  templateUrl: './chat.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements AfterViewInit {
  @ViewChild('target', { static: true })
  target!: ElementRef<HTMLDivElement>;
  display: boolean = true;
  display2: boolean = true;
  currentUser: any;
  datas: any;

  constructor(
    private service: ToggleNavService,
    private authService: AuthService,
    private httpService: HttpService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.datas = this.service.getListingDetailsMessage();

    if (isPlatformBrowser(this.platformId)) {
      if (window?.innerWidth < 1299) {
        this.display = false;
      } else {
        this.display = true;
      }

      let bookingId: any = localStorage.getItem(
        baseUrl.localStorageSelectedBooking
      );

      if (JSON.parse(bookingId)) {
        this.getBookingDetails(JSON.parse(bookingId));
      }

      let currentUser: any = localStorage.getItem(
        baseUrl.localStorageSelectedChat
      ) as any;

      if (currentUser?.u_id) {
        this.currentUser = JSON.parse(currentUser);
      }
    }
  }

  getCurrentuser(data: any) {
    if (isPlatformBrowser(this.platformId)) {
      if (window?.innerWidth < 1299) {
        this.display2 = false;
        this.display = true;
      }

      this.currentUser = data;
      this.target?.nativeElement?.scrollIntoView();
    }
  }

  getBookingDetails(id: string) {
    this.httpService
      .getAuthSingle(
        baseUrl.bookings +
          `/${id}/?include=listing,user&fields[user]=first_name,last_name,uuid&fields[listing.host]=first_name,last_name,uuid,pictures&fields[bookings]=uuid,booking_code,reason_for_decline,check_in,check_out,status,payment_status,amount,guests,created_at&fields[listing]=uuid,reviews_score,reviews_count,pictures,collection_id,type,no_of_guests,no_of_bedrooms,no_of_beds,no_of_private_bathroom,no_of_dedicated_bathroom,no_of_shared_bathroom,street_address,apt_suite,city,state,zipcode,country,longitude,latitude,title,description,is_instant_bookable,minimum_nights,maximum_nights,check_in,check_out,available_from,available_to,price_per_night,cleaning_fee,occupancy_taxes,status,amenities,house_rules,created_at`
      )
      .subscribe((data: any) => {
        this.datas = data?.data;
      });
  }

  back() {
    this.display2 = true;
    this.display = false;
  }

  ngAfterViewInit(): void {
    this.authService.checkExpired();
  }
}
