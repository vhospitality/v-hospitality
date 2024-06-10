import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
  PLATFORM_ID,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { SliderModule } from 'primeng/slider';
import { Subscription } from 'rxjs';
import { baseUrl } from '../../../../environments/environment';
import { AuthService } from '../../../global-services/auth.service';
import { HttpService } from '../../../global-services/http.service';
import { SeoService } from '../../../global-services/seo.service';
import { BackButtonComponent } from '../../components/back-button/back-button.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { MapComponent } from '../../components/map/map.component';
import { NoDataMessageComponent } from '../../components/no-data-message/no-data-message.component';
import { ToggleNavService } from '../../dashboard-service/toggle-nav.service';

@Component({
  selector: 'app-accommodation-listing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    CalendarModule,
    PaginatorModule,
    MatButtonModule,
    HeaderComponent,
    FooterComponent,
    MapComponent,
    NoDataMessageComponent,
    SkeletonModule,
    LazyLoadImageModule,
    RouterModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSliderModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    SliderModule,
    InputTextModule,
    MatButtonModule,
    BackButtonComponent,
  ],
  templateUrl: './accommodation-listing.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  // providers: [{ provide: LAZYLOAD_IMAGE_HOOKS, useClass: ScrollHooks }],
  styleUrls: ['./accommodation-listing.component.scss'],
})
export class AccommodationListingComponent implements AfterViewInit {
  @ViewChild('fform') feedbackFormDirective: any;
  @Input() adressType: any;
  @Output() setAddress: EventEmitter<any> = new EventEmitter();
  @ViewChild('addresstext') addresstext: any;
  address: any;
  feedbackForm: any = FormGroup;
  total_records = 0;
  datas2: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  datas: any[] = [];
  perPage = 12;
  dafaultImage: string = baseUrl.defaultImage;
  errorMessage: string = 'No accommodation found at the moment';
  filterObject = {};
  serviceData: any;
  map: any;
  value?: string;
  minimumDate = new Date();

  filters: any[] = [
    { name: 'All', code: undefined },
    { name: 'Instant book', code: 'is_instant_bookable' },
    { name: 'Expensive', code: '+price' },
    { name: 'Cheapest', code: '-price' },
  ];

  rangeValues: number[] = [100, 800];
  wishlists: any[] = [];
  newAddedWishlist: any[] = [];
  newAddedWishlist2: any[] = [];
  clickEventSubscription?: Subscription;
  isLogin: boolean = false;

  constructor(
    private httpService: HttpService,
    private fb: FormBuilder,
    private service: ToggleNavService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private datepipe: DatePipe,
    private seo: SeoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.seo.updateSeoTags({
      title: 'Accommodations' + ' - ' + baseUrl.feDomain,
    });

    this.isLogin = this.authService.isLoggedIn();

    this.createForm();

    this.serviceData = this.service.getAccommodationMessage();

    if (this.serviceData) {
      this.feedbackForm.patchValue({
        state: this.serviceData?.country?.formatted_address,
      });

      this.address = this.serviceData?.country;
    }

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

    this.paginateData();
  }

  ngAfterViewInit() {
    this.getPlaceAutocomplete();
  }

  stopPropagation(event: any) {
    event.stopPropagation();
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      date: [''],
      state: [''],
      search: [''],
      filter: [''],
    });
  }

  paginateData(event?: any) {
    this.datas2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    this.datas = [];
    this.filterObject = {};
    let priceType: any = '';

    const get_current_page = event?.first + this.perPage || this.perPage;

    if (this.feedbackForm.value.search) {
      Object.assign(this.filterObject, {
        'filter[title]': this.feedbackForm.value.search,
      });
    }

    if (this.feedbackForm.value?.state || this.address) {
      Object.assign(this.filterObject, {
        'filter[state]':
          this.address?.address_components?.find(
            (n: any) =>
              n?.types.includes('locality') ||
              n?.types.includes('administrative_area_level_1')
          )?.long_name ||
          this.address?.state ||
          '',
        'filter[country]':
          this.address?.address_components?.find((n: any) =>
            n?.types.includes('country')
          )?.long_name ||
          this.address?.country ||
          '',
        'filter[city]':
          this.address?.address_components?.find(
            (n: any) =>
              n?.types.includes('sublocality') ||
              n?.types.includes('neighborhood')
          )?.long_name ||
          this.address?.city ||
          '',
      });
    }

    if (this.serviceData?.collection?.uuid) {
      Object.assign(this.filterObject, {
        'filter[collection.uuid]': this.serviceData?.collection?.uuid,
      });
    }

    if (this.feedbackForm.value.filter == 'is_instant_bookable') {
      Object.assign(this.filterObject, {
        'filter[is_instant_bookable]': 1,
      });
    }

    if (
      this.feedbackForm.value.filter == '+price' ||
      this.feedbackForm.value.filter == '-price'
    ) {
      priceType = `&sort=${this.feedbackForm.value.filter}`;
    }

    if (this.feedbackForm.value.date) {
      Object.assign(this.filterObject, {
        'filter[available_from]': this.datepipe.transform(
          this.feedbackForm.value.date,
          'YYYY-MM-dd'
        ),
      });
    }

    let url = new URLSearchParams(this.filterObject).toString();

    this.httpService
      .getSingleNoAuth(
        baseUrl.listing +
          `/?per_page=${this.perPage}&page=${
            get_current_page / this.perPage
          }&include=media,reviews_count&fields[listings]=uuid,title,amenities,apt_suite,available_from,available_to,check_in,check_out,description,is_instant_bookable,latitude,longitude,price_per_night,status,street_address,title,type,user_id,uuid&${url}${priceType}`
      )
      .subscribe(
        (data: any) => {
          this.datas = data?.data?.data;
          this.total_records = data?.data?.total;
          this.datas2 = [];
        },
        (err) => {
          this.datas2 = [];
          this.datas = [];
          this.total_records = 0;
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
          () => {
            this.removeWishlist(uuid);
            this.deleteWishlist(uuid);

            this.snackBar.open('Successfully deleted wishlist item', 'x', {
              duration: 3000,
              panelClass: 'success',
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
          },
          () => {
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

  clearFilter() {
    this.feedbackFormDirective.resetForm();
    this.address = undefined;
    this.paginateData();
  }

  private getPlaceAutocomplete() {
    if (isPlatformBrowser(this.platformId)) {
      const autocomplete = new google.maps.places.Autocomplete(
        this.addresstext?.nativeElement,
        {
          // componentRestrictions: { country: 'NG' },
          types: [this.adressType], // 'establishment' / 'address' / 'geocode'
        }
      );
      google.maps.event.addListener(autocomplete, 'place_changed', () => {
        const place = autocomplete.getPlace();
        this.invokeEvent(place);
      });
    }
  }

  invokeEvent(place: any) {
    this.address = place;
    this.setAddress.emit(place);
  }
}
