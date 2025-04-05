import {
  CommonModule,
  NgOptimizedImage,
  isPlatformBrowser,
} from '@angular/common';
import {
  AfterViewInit,
  Component,
  HostListener,
  Inject,
  Input,
  PLATFORM_ID,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ImageModule } from 'primeng/image';
import { RatingModule } from 'primeng/rating';
import { SkeletonModule } from 'primeng/skeleton';
import { Subscription } from 'rxjs';
import { baseUrl } from '../../../../../environments/environment';
import { AuthService } from '../../../../global-services/auth.service';
import { HttpService } from '../../../../global-services/http.service';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';
import { NoDataMessageComponent } from '../../no-data-message/no-data-message.component';
import { BestHomesComponent } from '../best-homes/best-homes.component';
import { CollectionTagComponent } from '../collection-tag/collection-tag.component';
import { ListPropertyBackgroundComponent } from '../list-property-background/list-property-background.component';

@Component({
  selector: 'app-apartments',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ListPropertyBackgroundComponent,
    BestHomesComponent,
    SkeletonModule,
    LazyLoadImageModule,
    NoDataMessageComponent,
    CollectionTagComponent,
    ImageModule,
    NgOptimizedImage,
    RatingModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './apartments.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./apartments.component.scss'],
})
export class ApartmentsComponent implements AfterViewInit {
  @Input() title: any;
  @Input() review: any;
  ratingValue: number = 3;
  datas2: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  datas: any[] = [];
  datas3: any[] = [];
  perPage = 34;
  total: number = 0;
  total2: number = 0;
  dafaultImage: string = baseUrl.defaultImage;
  errorMessage: string = 'No record found at the moment.';
  wishlists: any[] = [];
  newAddedWishlist: any[] = [];
  newAddedWishlist2: any[] = [];
  isLoadedList: any[] = [];
  isLogin: boolean = false;
  clickEventSubscription?: Subscription;
  filterObject: any = {};
  country: string | undefined;

  constructor(
    private httpService: HttpService,
    private authService: AuthService,
    private service: ToggleNavService,
    private snackBar: MatSnackBar,
    private direct: ActivatedRoute,

    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.direct.queryParams.subscribe((params: any) => {
      this.country = params.country;
      console.log('params comp', params.country);
    });
    (window as any).fbq('track', 'ViewContent');
  }

  ngAfterViewInit(): void {
    this.isLogin = this.authService.isLoggedIn();

    this.getApartments();

    let apartments: any = this.service.getApartmentMessage();

    console.log('apartments', apartments);
    if (apartments) {
      this.datas = apartments;
      this.datas3 = apartments;
      this.datas2 = [];
      this.total = apartments?.length || 0;
      this.total2 = apartments?.length || 0;
    } else {
      // this.getApartments();
    }

    this.clickEventSubscription = this.service
      .getIsLoginClickEvent()
      .subscribe(() => {
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

    this.arrangeCard();
  }

  getApartments(data2?: any) {
    this.datas2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    this.datas = [];
    this.filterObject = {};

    let url = new URLSearchParams(data2).toString();

    this.httpService
      .getSingleNoAuth(
        baseUrl.listing +
          `/?include=reviews_count,collection,media&fields[listings]=uuid,title,amenities,apt_suite,available_from,available_to,check_in,check_out,city,cleaning_fee,collection_id,country,created_at,description,house_rules,is_instant_bookable,latitude,longitude,maximum_nights,minimum_nights,no_of_bedrooms,no_of_beds,no_of_dedicated_bathroom,no_of_guests,no_of_private_bathroom,no_of_shared_bathroom,occupancy_taxes,price_per_night,state,status,street_address,title,type,updated_at,user_id,uuid,zipcode&fields&fields[collection]=name,uuid&per_page=${
            this.perPage
          }&${url}${this.country ? '&filter[country]=' + this.country : ''}`
      )
      .subscribe(
        (data: any) => {
          const sortListing = data?.data?.data.sort(
            (a: any, b: any) =>
              Date.parse(b.created_at) - Date.parse(a.created_at)
          );

          this.errorMessage = `No ${
            data2?.collection_name || data2?.['filter[title]'] || ''
          } record found at the moment.`;

          this.datas2 = [];
          this.datas = sortListing;
          this.datas3 = sortListing;
          this.total = data?.data?.total;
          this.total2 = data?.data?.total;

          this.service.setApartmentMessage(sortListing);
          this.arrangeCard();
        },
        (err) => {
          this.datas2 = [];
        }
      );
  }

  getWishlist() {
    this.httpService
      .getAuthSingle(
        baseUrl.wishlist + '/?per_page=1&include=listing&fields[listing]=uuid'
      )
      .subscribe((data: any) => {
        for (let n of data?.data) {
          this.newAddedWishlist.push(n?.listing?.uuid);
        }
        this.newAddedWishlist2 = data?.data;
        this.service.setWishlistMessage(data?.data);
        this.service.sendIsLoginClickEvent();
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
      this.service.sendIsLoginClickEvent();
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
            this.service.sendIsLoginClickEvent();

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

  getImages(images: any) {
    for (let image of images) {
      let slitImage = image?.url?.split(
        'https://v-space.nyc3.digitaloceanspaces.com/listings/'
      );

      if (slitImage?.length > 1) {
        return slitImage[1];
      } else {
        return baseUrl.defaultImage;
      }
    }
  }

  arrangeCard() {
    if (isPlatformBrowser(this.platformId)) {
      if (window?.innerWidth > 1401 && this.total2 > 4) {
        this.total = 10;
      }
      if (window?.innerWidth > 1401 && this.total2 <= 4) {
        this.total = 4;
      }
      if (window?.innerWidth <= 1400) {
        this.total = 4;
      }
      if (window?.innerWidth <= 1300) {
        this.total = 3;
      }
      if (window?.innerWidth <= 850) {
        this.total = 2;
      }
      if (window?.innerWidth <= 519) {
        this.total = 1;
      }
    }
  }

  displayImageUrl(image: string) {
    const splitImage = image?.split(baseUrl.lazyLoadUrl);
    if (splitImage?.length > 1) {
      return splitImage[1];
    } else {
      return image;
    }
  }

  onImageLoad(uuid: string) {
    this.isLoadedList.push(uuid);
  }

  // get width of hearder when resizing
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.arrangeCard();
  }
}
