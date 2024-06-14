import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import {
  Subscription,
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  tap,
} from 'rxjs';
import { baseUrl } from '../../../../environments/environment';
import { AuthService } from '../../../global-services/auth.service';
import { HttpService } from '../../../global-services/http.service';
import { BackButtonComponent } from '../../components/back-button/back-button.component';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { ListingDetailsComponent } from '../../components/host-listing-component/listing-details/listing-details.component';
import { PolicyRulesComponent } from '../../components/host-listing-component/policy-rules/policy-rules.component';
import { PriceAvailabilityComponent } from '../../components/host-listing-component/price-availability/price-availability.component';
import { NoDataMessageComponent } from '../../components/no-data-message/no-data-message.component';
import { ToggleNavService } from '../../dashboard-service/toggle-nav.service';

@Component({
  selector: 'app-host-listing',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DropdownModule,
    CalendarModule,
    MatButtonModule,
    TableModule,
    MatMenuModule,
    ListingDetailsComponent,
    PolicyRulesComponent,
    PriceAvailabilityComponent,
    RouterModule,
    MatMenuModule,
    BackButtonComponent,
    NoDataMessageComponent,
  ],
  templateUrl: './host-listing.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./host-listing.component.scss'],
})
export class HostListingComponent implements AfterViewInit {
  viewType: string = 'default';
  @ViewChild('input') input: ElementRef | any;
  listings: any[] = [];
  loading: boolean = true;
  activityValues: number[] = [0, 100];
  total: number = 0;
  perPage = 15;
  filterObject: any = {};
  search: string = '';
  listingFiter: any[] = [
    {
      month: 'all',
    },
    {
      month: 'published',
    },
    {
      month: 'unpublished',
    },
    {
      month: 'rejected',
    },
    {
      month: 'booked',
    },
  ];
  earningsMonthActive: string = '';
  currentType: string = 'details';
  listingDetails: any;
  userData: any = this.service.getProfileMessage();
  clickEventSubscription?: Subscription;
  dafaultImage: string = baseUrl.defaultImage;

  constructor(
    private service: ToggleNavService,
    private dialog: MatDialog,
    private httpService: HttpService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.paginateLoadData();

    this.clickEventSubscription = this.service
      .getIsLoginClickEvent()
      .subscribe(() => {
        this.userData = this.service.getProfileMessage();
      });

    if (!this.userData) {
      this.service.sendIsLoginClickEvent();
    }

    this.route.queryParamMap.subscribe((params: any) => {
      const param = params?.params;

      if (param?.name) {
        this.openDialog({
          message: `Congratulations! You've successfully subscribed to ${param?.name}, and you can now list your home!`,
          requestType: 'success-error',
          requestMessage: '',
        });
      }
    });
  }

  paginateLoadData(event?: any) {
    this.loading = true;
    this.listings = [];
    this.filterObject = {};
    const get_current_page = event?.first + this.perPage || this.perPage;

    if (this.input?.nativeElement?.value) {
      Object.assign(this.filterObject, {
        'filter[title]': this.input?.nativeElement?.value,
      });
    }

    if (this.earningsMonthActive !== 'all' && this.earningsMonthActive !== '') {
      Object.assign(this.filterObject, {
        'filter[status]': this.earningsMonthActive,
      });
    }

    let url = new URLSearchParams(this.filterObject).toString();

    this.httpService
      .getAuthSingle(
        baseUrl.hostListing +
          `/?per_page=${
            this.perPage
          }&include=media,collection,listing_updates&fields[listings]=uuid,title,has_advance_verification,amenities,apt_suite,available_from,available_to,check_in,check_out,city,cleaning_fee,collection_id,country,created_at,description,house_rules,is_instant_bookable,latitude,longitude,maximum_nights,minimum_nights,no_of_bedrooms,no_of_beds,no_of_dedicated_bathroom,no_of_guests,no_of_private_bathroom,no_of_shared_bathroom,occupancy_taxes,price_per_night,state,status,street_address,title,type,updated_at,user_id,uuid,zipcode&page=${
            get_current_page / this.perPage
          }&${url}`
      )
      .subscribe(
        (data: any) => {
          this.loading = false;
          this.listings = data?.data?.data;
          this.total = data?.data?.total;
        },
        () => {
          this.authService.checkExpired();
          this.loading = false;
          this.total = 0;
          this.listings = [];
        }
      );
  }

  openDialog(data: any) {
    this.dialog.closeAll();
    let dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: 'dialog',
        data: data,
      },
    });

    // after dialog close
    dialogRef.afterClosed().subscribe((result) => {});
  }

  ngAfterViewInit() {
    this.authService.checkExpired();

    fromEvent(this.input?.nativeElement || '', 'keyup')
      .pipe(
        filter(Boolean),
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          this.paginateLoadData();
        })
      )
      .subscribe();
  }

  selectMonthActive(m: any): void {
    this.earningsMonthActive = m?.month;
    this.paginateLoadData();
  }

  createlisting() {
    this.service.setPropertyMessage(undefined);
    this.router.navigate(['/host-subscription']);
  }

  changeType(type: string) {
    this.currentType = type;
  }

  back() {
    this.viewType = 'default';
    this.listingDetails = undefined;
    this.paginateLoadData();
  }

  viewListing(listing: any) {
    this.viewType = 'view';

    const sampleData = {
      uuid: listing?.uuid,
      describePlace: {
        home_type: listing?.home_type,
        collection_id: listing?.collection?.uuid,
      },
      placeType: listing?.type,
      totalGuest: [
        {
          id: 1,
          name: 'Guests',
          total: listing?.no_of_guests || 0,
        },
        {
          id: 2,
          name: 'Bedrooms',
          total: listing?.no_of_bedrooms || 0,
        },
        {
          id: 3,
          name: 'Beds',
          total: listing?.no_of_beds || 0,
        },
      ],
      address: {
        address: listing?.street_address,
        suite: listing?.apt_suite,
        state: listing?.state,
        city: listing?.city,
        zip: listing?.zipcode,
        longitude: listing?.longitude,
        latitude: listing?.latitude,
        country: listing?.country,
      },
      amenities: listing?.amenities?.filter((n: any) => {
        return { name: n?.name, value: true, uuid: n?.uuid };
      }),
      document: { fileText: '', files: listing?.documents },
      photos: {
        files: listing?.pictures,
      },
      bedroomKind: [
        {
          id: 1,
          name: 'Private and attached',
          sub_title: "It's connected to the guest's room and is just for them.",
          total: listing?.no_of_private_bathroom || 0,
        },
        {
          id: 2,
          name: 'Dedicated',
          sub_title:
            "It's private, but accessed via a shared space, like a hallway.",
          total: listing?.no_of_dedicated_bathroom || 0,
        },
        {
          id: 3,
          name: 'Shared',
          sub_title: "It's shared with other people.",
          total: listing?.no_of_shared_bathroom || 0,
        },
      ],
      guestStay: {
        min: listing?.minimum_nights || 1,
        max: listing?.maximum_nights || 1,
      },
      houseRulesTime: {
        checkin: listing?.check_in,
        checkout: listing?.check_out,
      },
      guestBook: listing?.is_instant_bookable == 0 ? false : true,
      has_advance_verification:
        listing?.has_advance_verification == 0 ? false : true,
      price: {
        price: listing?.price_per_night,
        cleaning: listing?.cleaning_fee,
        tax: listing?.occupancy_taxes,
      },
      propertyDetails: {
        title: listing?.title,
        description: listing?.description,
        apartment_size: listing?.apartment_size,
      },
      step: listing?.step,
      houseRules: listing?.house_rules?.filter((n: any) => {
        return { name: n?.name, value: true, uuid: n?.uuid };
      }),
      type: 'summary',
      status: listing?.status,
    };

    this.listingDetails = sampleData;
    this.service.setAccommodationMessage(sampleData);
  }

  reasonForDecline(data: any) {
    const data2: any = {
      data: {
        created_at: data?.created_at,
        price_per_night: data?.price_per_night,
        no_of_guests: data?.no_of_guests,
        reason:
          data?.listing_updates?.length > 0
            ? data?.listing_updates[0]?.reason
            : '',
        pictures:
          data?.pictures?.length > 0
            ? data?.pictures[0]?.url
            : this.dafaultImage,
        title: data?.title,
        description: data?.description,
        uuid: data?.uuid,
      },
    };

    this.router.navigate(['/listing-review', btoa(JSON.stringify(data2))]);
  }

  splitStatus(status: string) {
    let splitText = status.split('_');
    if (splitText.length > 1) {
      return splitText[0] + ' ' + splitText[1];
    } else {
      return status;
    }
  }

  redirectToSubscription(status: string) {
    if (status?.toLowerCase() === 'awaiting_subscription') {
      this.router.navigate(['/host-subscription/subscription']);
    }
  }
}
