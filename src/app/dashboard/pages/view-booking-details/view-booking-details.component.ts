import { CommonModule, DOCUMENT, Location } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { CarouselModule } from 'primeng/carousel';
import { DialogModule } from 'primeng/dialog';
import { GalleriaModule } from 'primeng/galleria';
import { SkeletonModule } from 'primeng/skeleton';
import { Subscription } from 'rxjs';
import { SeoService } from 'src/app/global-services/seo.service';
import { baseUrl } from '../../../../environments/environment';
import { AuthService } from '../../../global-services/auth.service';
import { HttpService } from '../../../global-services/http.service';
import { AccommodationDetailDetailComponent } from '../../components/accommodation-listing-component/accommodation-detail-detail/accommodation-detail-detail.component';
import { AccommodationDetailHostComponent } from '../../components/accommodation-listing-component/accommodation-detail-host/accommodation-detail-host.component';
import { AccommodationDetailRulesComponent } from '../../components/accommodation-listing-component/accommodation-detail-rules/accommodation-detail-rules.component';
import { AccommodationDetailsMapComponent } from '../../components/accommodation-listing-component/accommodation-details-map/accommodation-details-map.component';
import { AccommodationDetailsReviewComponent } from '../../components/accommodation-listing-component/accommodation-details-review/accommodation-details-review.component';
import { GuestDetailsComponent } from '../../components/accommodation-listing-component/guest-details/guest-details.component';
import { ViewBookingFormComponent } from '../../components/accommodation-listing-component/view-booking-form/view-booking-form.component';
import { BackButtonComponent } from '../../components/back-button/back-button.component';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { NoDataMessageComponent } from '../../components/no-data-message/no-data-message.component';
import { ToggleNavService } from '../../dashboard-service/toggle-nav.service';

@Component({
  selector: 'app-view-booking-details',
  standalone: true,
  imports: [
    CommonModule,
    CarouselModule,
    AccommodationDetailsMapComponent,
    AccommodationDetailsReviewComponent,
    ViewBookingFormComponent,
    AccommodationDetailHostComponent,
    AccommodationDetailRulesComponent,
    AccommodationDetailDetailComponent,
    HeaderComponent,
    FooterComponent,
    SkeletonModule,
    LazyLoadImageModule,
    NoDataMessageComponent,
    MatButtonModule,
    GalleriaModule,
    GuestDetailsComponent,
    DialogModule,
    BackButtonComponent,
    AvatarModule,
    AvatarGroupModule,
    ShareButtonsModule,
    ShareIconsModule,
  ],
  templateUrl: './view-booking-details.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./view-booking-details.component.scss'],
})
export class ViewBookingDetailsComponent implements AfterViewInit {
  id: any;
  clickEventSubscription?: Subscription;
  isLogin: boolean = false;
  listingDetails: any;
  dafaultImage: string = baseUrl.defaultImage;
  wishlists: any[] = [];
  newAddedWishlist: any[] = [];
  newAddedWishlist2: any[] = [];
  displayBasic: boolean = false;
  activeIndex: number = 0;
  clickEventSubscription2?: Subscription;
  paymentRequired: boolean = false;
  bookingId: any;
  userData: any = this.service.getProfileMessage();
  displayLoaderDialog: boolean = false;
  isLoadedList: any[] = [];

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
    private direct: ActivatedRoute,
    private _location: Location,
    private service: ToggleNavService,
    private authService: AuthService,
    private httpService: HttpService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private seo: SeoService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.isLogin = this.authService.isLoggedIn();

    this.direct.queryParamMap.subscribe((params: any) => {
      this.id = params?.params;
      this.getDetails(params?.params);
    });

    this.service.getIsLoginClickEvent().subscribe(() => {
      this.isLogin = this.authService.isLoggedIn();
    });

    if (this.isLogin) {
      let wishlist: any = this.service.getWishlistMessage();
      if (wishlist) {
        for (let n of wishlist) {
          this.newAddedWishlist.push(n?.listing?.uuid);
        }

        this.newAddedWishlist2 = wishlist;
      } else {
        this.getWishlist();
      }
    }

    this.clickEventSubscription2 = this.service
      .getIsLoginClickEvent()
      .subscribe(() => {
        this.userData = this.service.getProfileMessage();

        if (this.paymentRequired) {
          this.paymentRequired = false;
          this.getBookingDetails();
        }
      });

    if (this.id?.payment === '1') {
      if (!this.isLogin) {
        this.paymentRequired = true;
        this.openDialog('', 'login2');
      } else {
        this.paymentRequired = false;
        this.getBookingDetails();
      }
    }
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

  getBookingDetails() {
    this.displayLoaderDialog = true;

    this.httpService
      .getAuthSingle(
        baseUrl.bookings +
          `/${this.id?.booking}/?include=listing,user&fields[user]=first_name,last_name,device_token,uuid,email,phone,pictures&fields[listing.host]=first_name,last_name,uuid,email,phone,pictures&fields[bookings]=uuid,booking_code,reason_for_decline,amount,check_in,check_out,status,payment_status,guests,created_at&fields[listing]=uuid,reviews_score,reviews_count,pictures,collection_id,type,no_of_guests,no_of_bedrooms,no_of_beds,no_of_private_bathroom,no_of_dedicated_bathroom,no_of_shared_bathroom,street_address,apt_suite,city,state,zipcode,country,longitude,latitude,title,description,is_instant_bookable,minimum_nights,maximum_nights,check_in,check_out,available_from,available_to,price_per_night,cleaning_fee,occupancy_taxes,status,amenities,house_rules,created_at`
      )
      .subscribe(
        (data: any) => {
          this.displayLoaderDialog = false;
          if (
            data?.data?.status == 'accepted' &&
            data?.data?.payment_status == 'pending' &&
            this.userData?.uuid == data?.data?.user?.uuid &&
            data?.data?.can_pay == 1
          ) {
            this.configurePaymentOption(data?.data);
          } else if (data?.data?.can_pay === 4) {
            this.snackBar.open(
              `We apologize, but ${
                data?.data?.listing?.title || 'this apartment'
              } is currently unavailable.`,
              'x',
              {
                duration: 7000,
                panelClass: 'error',
                horizontalPosition: 'center',
                verticalPosition: 'top',
              }
            );
          } else {
            this.snackBar.open('Payment link expired!', 'x', {
              duration: 7000,
              panelClass: 'error',
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
          }
        },
        (err) => {
          this.displayLoaderDialog = false;
        }
      );
  }

  getTotalGuest(data: any) {
    return (
      data?.guests?.adults + data?.guests?.children + data?.guests?.infants
    );
  }

  getNumberOfNight(data: any) {
    const date1: any = new Date(data?.check_in);
    const date2: any = new Date(data?.check_out);
    date1.setHours(0, 0, 0, 0);
    date2.setHours(0, 0, 0, 0);

    const diffTime1 = Math.abs(date2 - date1);
    const diffDays1 = Math.floor(diffTime1 / (1000 * 60 * 60 * 24));
    return diffDays1 < 1 ? 1 : diffDays1;
  }

  getTaxAmount(data: any) {
    const tax = data?.listing?.occupancy_taxes / 100;
    const nightPrice =
      data?.listing?.price_per_night * this.getNumberOfNight(data);
    const amount = nightPrice + this.getServiceChargeAmount(data);
    return amount * tax;
  }

  getServiceChargeAmount(data: any) {
    const tax = 6 / 100;
    const serviceCharge =
      data?.listing?.price_per_night * this.getNumberOfNight(data);
    return serviceCharge * tax;
  }

  getTotalAmount(data: any) {
    const tax = this.getTaxAmount(data);
    const service_fee = this.getServiceChargeAmount(data);
    const nightPrice =
      data?.listing?.price_per_night * this.getNumberOfNight(data);
    const total = nightPrice + service_fee + tax;
    return total;
  }

  configurePaymentOption(data: any) {
    Object.assign(data, {
      total: data?.payment_breakdown?.amount,
      type: 'booking',
    });
    this.openDialog(data, 'card');
  }

  checkExpired(data: any) {
    const date1: any = new Date(data?.check_in);
    const date2: any = new Date();
    // Calculate the difference in milliseconds
    const differenceInMilliseconds = Math.abs(date2 - date1);
    // Convert milliseconds to hours
    const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);
    if (Number(differenceInHours) >= 24) {
      return true;
    } else {
      return false;
    }
  }

  getUrl() {
    return (
      this.document.location.protocol +
      '//' +
      this.document.location.hostname +
      `/accommodations-details/${this.id?.listing}`
    );
  }

  imageClick(pictures: any, uuid: any) {
    const index = pictures.findIndex((n: any) => n?.uuid === uuid);
    this.activeIndex = index;
    this.displayBasic = true;
  }

  getWishlist() {
    this.httpService
      .getAuthSingle(
        baseUrl.wishlist + '/?per_page=1&include=listing,&fields[listing]=uuid'
      )
      .subscribe((data: any) => {
        for (let n of data?.data) {
          this.newAddedWishlist.push(n?.listing?.uuid);
        }
        this.newAddedWishlist2 = data?.data;
        this.service.setWishlistMessage(data?.data);
      });
  }

  // remove wislist from loading
  removeWishlist(uuid: string) {
    let index = this.wishlists.indexOf(uuid);

    if (index !== -1) {
      this.wishlists.splice(index, 1);
    }
  }

  // delete wishlist
  deleteWishlist(uuid: string) {
    let index = this.newAddedWishlist.indexOf(uuid);
    let index2 = this.newAddedWishlist2.findIndex(
      (n: any) => n?.listing?.uuid === uuid
    );

    if (index !== -1) {
      this.newAddedWishlist.splice(index, 1);
    }

    if (index2 !== -1) {
      this.newAddedWishlist2.splice(index, 1);
      this.service.setWishlistMessage(this.newAddedWishlist2);
    }
  }

  addWishlist(uuid: string) {
    let wishlistId = this.newAddedWishlist2.find(
      (n: any) => n?.listing?.uuid === uuid
    );

    // add to wishlist
    if (!this.newAddedWishlist.includes(uuid)) {
      this.wishlists.push(uuid);

      this.httpService
        .postData(baseUrl.listing + `/${uuid}/wishlists`, '')
        .subscribe(
          (data: any) => {
            this.newAddedWishlist.push(uuid);
            this.newAddedWishlist2.push({
              listing: { uuid: uuid },
              uuid: data?.data?.uuid,
            });

            this.service.setWishlistMessage(this.newAddedWishlist2);
            this.removeWishlist(uuid);

            this.snackBar.open('Successfully added wishlist item', 'x', {
              duration: 3000,
              panelClass: 'success',
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
          },
          () => {
            this.removeWishlist(uuid);

            this.snackBar.open('Failed to add wishlist item', 'x', {
              duration: 3000,
              panelClass: 'error',
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
          }
        );
    }
    // remove from wishlist
    else {
      this.wishlists.push(uuid);

      this.httpService
        .deleteData(baseUrl.wishlist, `/${wishlistId?.uuid}`)
        .subscribe(
          (data: any) => {
            this.removeWishlist(uuid);
            this.deleteWishlist(uuid);

            this.snackBar.open('Successfully deleted wishlist item', 'x', {
              duration: 3000,
              panelClass: 'success',
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
          },
          (err) => {
            this.removeWishlist(uuid);

            this.snackBar.open('Failed to delete wishlist item', 'x', {
              duration: 3000,
              panelClass: 'error',
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
          }
        );
    }
  }

  getDetails(id: any) {
    this.listingDetails = undefined;
    this.httpService
      .getAuthSingle(
        baseUrl.bookings +
          `/${id?.booking}/?include=listing,user&fields[user]=first_name,last_name,device_token,uuid,email,phone,pictures&fields[listing.host]=first_name,last_name,uuid,email,phone,pictures&fields[bookings]=uuid,booking_code,reason_for_decline,check_in,check_out,status,payment_status,guests,created_at&fields[listing]=uuid,reviews_score,reviews_count,pictures,collection_id,type,no_of_guests,no_of_bedrooms,no_of_beds,no_of_private_bathroom,no_of_dedicated_bathroom,no_of_shared_bathroom,street_address,apt_suite,city,state,zipcode,country,longitude,latitude,title,description,is_instant_bookable,minimum_nights,maximum_nights,check_in,check_out,available_from,available_to,price_per_night,cleaning_fee,occupancy_taxes,status,amenities,house_rules,created_at`
      )
      .subscribe(
        (data: any) => {
          this.listingDetails = data?.data;

          Object.assign(this.listingDetails?.listing, {
            params: id,
          });

          this.seo.updateSeoTags({
            title:
              this.listingDetails?.listing?.title + ' - ' + baseUrl.feDomain,
            image:
              this.listingDetails?.listing?.pictures?.length > 0
                ? this.listingDetails?.listing?.pictures[0]
                : undefined,
            description: this.listingDetails?.listing?.description,
          });
        },
        () => {
          this.listingDetails = undefined;
        }
      );
  }

  splitBookingStatus(status: string) {
    let splitText = status.split('_');
    if (splitText.length > 1) {
      return splitText[0] + ' ' + splitText[1];
    } else {
      return status;
    }
  }

  onImageLoad(uuid: string) {
    this.isLoadedList.push(uuid);
  }

  ngAfterViewInit() {
    this.authService.checkExpired();
  }

  back() {
    this._location.back();
  }
}
