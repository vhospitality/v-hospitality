import { CommonModule, Location, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  PLATFORM_ID,
  ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { CarouselModule } from 'primeng/carousel';
import { GalleriaModule } from 'primeng/galleria';
import { ImageModule } from 'primeng/image';
import { SkeletonModule } from 'primeng/skeleton';
import { Subscription } from 'rxjs';
import { baseUrl } from '../../../../environments/environment';
import { AuthService } from '../../../global-services/auth.service';
import { HttpService } from '../../../global-services/http.service';
import { SeoService } from '../../../global-services/seo.service';
import { AccommodationDetailDetailComponent } from '../../components/accommodation-listing-component/accommodation-detail-detail/accommodation-detail-detail.component';
import { AccommodationDetailFormComponent } from '../../components/accommodation-listing-component/accommodation-detail-form/accommodation-detail-form.component';
import { AccommodationDetailHostComponent } from '../../components/accommodation-listing-component/accommodation-detail-host/accommodation-detail-host.component';
import { AccommodationDetailRulesComponent } from '../../components/accommodation-listing-component/accommodation-detail-rules/accommodation-detail-rules.component';
import { AccommodationDetailsMapComponent } from '../../components/accommodation-listing-component/accommodation-details-map/accommodation-details-map.component';
import { AccommodationDetailsReviewComponent } from '../../components/accommodation-listing-component/accommodation-details-review/accommodation-details-review.component';
import { BackButtonComponent } from '../../components/back-button/back-button.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { NoDataMessageComponent } from '../../components/no-data-message/no-data-message.component';
import { ToggleNavService } from '../../dashboard-service/toggle-nav.service';

@Component({
  selector: 'app-accommodation-details',
  standalone: true,
  imports: [
    CommonModule,
    CarouselModule,
    AccommodationDetailsMapComponent,
    AccommodationDetailsReviewComponent,
    AccommodationDetailFormComponent,
    AccommodationDetailHostComponent,
    AccommodationDetailRulesComponent,
    AccommodationDetailDetailComponent,
    HeaderComponent,
    FooterComponent,
    SkeletonModule,
    LazyLoadImageModule,
    NoDataMessageComponent,
    ImageModule,
    GalleriaModule,
    BackButtonComponent,
    AvatarModule,
    AvatarGroupModule,
    MatButtonModule,
    ShareButtonsModule,
    ShareIconsModule,
  ],
  templateUrl: './accommodation-details.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./accommodation-details.component.scss'],
})
export class AccommodationDetailsComponent implements AfterViewInit {
  id!: string | null;
  clickEventSubscription?: Subscription;
  isLogin: boolean = false;
  listingDetails: any;
  dafaultImage: string = baseUrl.defaultImage;
  wishlists: any[] = [];
  newAddedWishlist: any[] = [];
  newAddedWishlist2: any[] = [];
  displayBasic: boolean = false;
  activeIndex: number = 0;
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
    private seo: SeoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  imageClick(pictures: any, uuid: any) {
    const index = pictures.findIndex((n: any) => n?.uuid === uuid);
    this.activeIndex = index;
    this.displayBasic = true;
  }

  getUrl() {
    if (isPlatformBrowser(this.platformId)) {
      return window.location.href;
    } else {
      return '';
    }
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
    let index2 = this.newAddedWishlist2.findIndex((n: any) => n?.uuid === uuid);

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

  getDetails(id: any) {
    this.listingDetails = undefined;
    this.httpService
      .getSingleNoAuth(
        baseUrl.listing +
          `/${id}/?include=host,media,reviews_count,blocked_dates&fields[host]=pictures,first_name,last_name,uuid`
      )
      .subscribe(
        (data: any) => {
          this.listingDetails = data?.data;
          this.seo.updateSeoTags({
            title: this.listingDetails?.title + ' - ' + baseUrl.feDomain,
            image:
              this.listingDetails?.pictures?.length > 0
                ? this.listingDetails?.pictures[0]?.url
                : undefined,
            description: this.listingDetails?.description,
          });
        },
        () => {
          this.listingDetails = undefined;
        }
      );
  }

  onImageLoad(uuid: string) {
    this.isLoadedList.push(uuid);
  }

  back() {
    this._location.back();
  }

  ngAfterViewInit(): void {
    this.isLogin = this.authService.isLoggedIn();

    this.direct.paramMap.subscribe((params) => {
      this.id = params.get('id');
      this.getDetails(params.get('id'));
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
  }
}
