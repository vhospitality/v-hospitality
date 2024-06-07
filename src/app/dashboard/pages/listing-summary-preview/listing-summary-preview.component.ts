import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { CarouselModule } from 'primeng/carousel';
import { GalleriaModule } from 'primeng/galleria';
import { ImageModule } from 'primeng/image';
import { SkeletonModule } from 'primeng/skeleton';
import { Subscription } from 'rxjs';
import { baseUrl } from '../../../../environments/environment';
import { AuthService } from '../../../global-services/auth.service';
import { HttpService } from '../../../global-services/http.service';
import { AccommodationDetailDetailComponent } from '../../components/accommodation-listing-component/accommodation-detail-detail/accommodation-detail-detail.component';
import { AccommodationDetailHostComponent } from '../../components/accommodation-listing-component/accommodation-detail-host/accommodation-detail-host.component';
import { AccommodationDetailRulesComponent } from '../../components/accommodation-listing-component/accommodation-detail-rules/accommodation-detail-rules.component';
import { AccommodationDetailsMapComponent } from '../../components/accommodation-listing-component/accommodation-details-map/accommodation-details-map.component';
import { AccommodationDetailsReviewComponent } from '../../components/accommodation-listing-component/accommodation-details-review/accommodation-details-review.component';
import { ListingSummaryFormComponent } from '../../components/accommodation-listing-component/listing-summary-form/listing-summary-form.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { NoDataMessageComponent } from '../../components/no-data-message/no-data-message.component';
import { ToggleNavService } from '../../dashboard-service/toggle-nav.service';

@Component({
  selector: 'app-listing-summary-preview',
  standalone: true,
  imports: [
    CommonModule,
    CarouselModule,
    AccommodationDetailsMapComponent,
    AccommodationDetailsReviewComponent,
    AccommodationDetailHostComponent,
    AccommodationDetailRulesComponent,
    AccommodationDetailDetailComponent,
    ListingSummaryFormComponent,
    HeaderComponent,
    FooterComponent,
    SkeletonModule,
    LazyLoadImageModule,
    NoDataMessageComponent,
    ImageModule,
    GalleriaModule,
  ],
  templateUrl: './listing-summary-preview.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./listing-summary-preview.component.scss'],
})
export class ListingSummaryPreviewComponent implements AfterViewInit {
  clickEventSubscription?: Subscription;
  loading: boolean = false;
  listingDetails: any;
  dafaultImage: string = baseUrl.defaultImage;
  displayBasic: boolean = false;
  activeIndex: number = 0;

  responsiveOptions: any[] = [
    {
      breakpoint: '1500px',
      numVisible: 5,
    },
    {
      breakpoint: '1024px',
      numVisible: 3,
    },
    {
      breakpoint: '768px',
      numVisible: 2,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
    },
  ];

  constructor(
    private authService: AuthService,
    private httpService: HttpService,
    private snackBar: MatSnackBar,
    private router: Router,
    private service: ToggleNavService
  ) {
    this.getDetails();
  }

  imageClick(pictures: any, uuid: any) {
    const index = pictures.findIndex((n: any) => n?.uuid === uuid);
    this.activeIndex = index;
    this.displayBasic = true;
  }

  getDetails() {
    this.listingDetails = undefined;
    this.httpService.getAuthSingle(baseUrl.draft).subscribe(
      (data: any) => {
        this.listingDetails = data?.data;

        const sampleData = {
          id: data?.data?.id,
          describePlace: {
            home_type: data?.data?.home_type,
            collection_id: data?.data?.collection?.uuid,
          },
          placeType: data?.data?.type,
          totalGuest: [
            {
              id: 1,
              name: 'Guests',
              total: data?.data?.no_of_guests || 0,
            },
            {
              id: 2,
              name: 'Bedrooms',
              total: data?.data?.no_of_bedrooms || 0,
            },
            {
              id: 3,
              name: 'Beds',
              total: data?.data?.no_of_beds || 0,
            },
          ],
          address: {
            address: data?.data?.street_address,
            suite: data?.data?.apt_suite,
            state: data?.data?.state,
            city: data?.data?.city,
            zip: data?.data?.zipcode,
            longitude: data?.data?.longitude,
            latitude: data?.data?.latitude,
            country: data?.data?.country,
          },
          amenities: data?.data?.amenities?.filter((n: any) => {
            return { name: n?.name, value: true, uuid: n?.uuid };
          }),
          document: { fileText: '', files: data?.data?.documents },
          photos: { files: data?.data?.pictures },
          bedroomKind: [
            {
              id: 1,
              name: 'Private and attached',
              sub_title:
                "It's connected to the guest's room and is just for them.",
              total: data?.data?.no_of_private_bathroom || 0,
            },
            {
              id: 2,
              name: 'Dedicated',
              sub_title:
                "It's private, but accessed via a shared space, like a hallway.",
              total: data?.data?.no_of_dedicated_bathroom || 0,
            },
            {
              id: 3,
              name: 'Shared',
              sub_title: "It's shared with other people.",
              total: data?.data?.no_of_shared_bathroom || 0,
            },
          ],
          guestStay: {
            min: data?.data?.minimum_nights || 1,
            max: data?.data?.maximum_nights || 1,
          },
          houseRulesTime: {
            checkin: data?.data?.check_in,
            checkout: data?.data?.check_out,
          },
          guestBook: data?.data?.is_instant_bookable == 0 ? false : true,
          has_advance_verification:
            data?.data?.has_advance_verification === 0 ? false : true,
          price: {
            price: data?.data?.price_per_night,
            cleaning: data?.data?.cleaning_fee,
            tax: data?.data?.occupancy_taxes,
          },
          propertyDetails: {
            title: data?.data?.title,
            description: data?.data?.description,
            apartment_size: data?.data?.apartment_size,
          },
          step: data?.data?.step,
          houseRules: data?.data?.house_rules?.filter((n: any) => {
            return { name: n?.name, value: true, uuid: n?.uuid };
          }),
          type: 'summary',
        };

        this.service.setAccommodationMessage(undefined);
        this.service.setPropertyMessage(undefined);
        this.service.accommodationMessage = undefined;
        this.service.propertyMessage = undefined;

        this.service.setPropertyMessage(sampleData);
        this.service.setAccommodationMessage(sampleData);
      },
      (err) => {
        this.listingDetails = undefined;
      }
    );
  }

  submitForApproval() {
    this.loading = true;
    this.httpService
      .postData(
        baseUrl.draft +
          `/${this.listingDetails?.id || this.listingDetails?.uuid}/approvals`,
        ''
      )
      .subscribe(
        (data: any) => {
          this.loading = false;
          this.router.navigate(['/property-pending-approval']);
        },
        (err) => {
          this.loading = false;
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

  ngAfterViewInit(): void {
    this.authService.checkExpired();
  }
}
