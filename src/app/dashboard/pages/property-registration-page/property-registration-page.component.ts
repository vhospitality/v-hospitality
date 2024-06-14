import { CommonModule, Location } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterModule } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { Subscription } from 'rxjs';
import { baseUrl } from '../../../../environments/environment';
import { AuthService } from '../../../global-services/auth.service';
import { HttpService } from '../../../global-services/http.service';
import { AddressComponent } from '../../components/property-signup-component/address/address.component';
import { AmenitiesComponent } from '../../components/property-signup-component/amenities/amenities.component';
import { ApartmentKycComponent } from '../../components/property-signup-component/apartment-kyc/apartment-kyc.component';
import { ApartmentPhotosComponent } from '../../components/property-signup-component/apartment-photos/apartment-photos.component';
import { BedroomKindComponent } from '../../components/property-signup-component/bedroom-kind/bedroom-kind.component';
import { DescribePlaceComponent } from '../../components/property-signup-component/describe-place/describe-place.component';
import { GuestStayComponent } from '../../components/property-signup-component/guest-stay/guest-stay.component';
import { GuestTotalComponent } from '../../components/property-signup-component/guest-total/guest-total.component';
import { HouseRulesComponent } from '../../components/property-signup-component/house-rules/house-rules.component';
import { HowGuestBookComponent } from '../../components/property-signup-component/how-guest-book/how-guest-book.component';
import { PriceComponent } from '../../components/property-signup-component/price/price.component';
import { PropertyDetailsComponent } from '../../components/property-signup-component/property-details/property-details.component';
import { SecondHouseRulesComponent } from '../../components/property-signup-component/second-house-rules/second-house-rules.component';
import { TypeofGuestComponent } from '../../components/property-signup-component/typeof-guest/typeof-guest.component';
import { ToggleNavService } from '../../dashboard-service/toggle-nav.service';

@Component({
  selector: 'app-property-registration-page',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatButtonModule,
    DescribePlaceComponent,
    TypeofGuestComponent,
    GuestTotalComponent,
    BedroomKindComponent,
    AddressComponent,
    HowGuestBookComponent,
    PropertyDetailsComponent,
    AmenitiesComponent,
    GuestStayComponent,
    HouseRulesComponent,
    SecondHouseRulesComponent,
    PriceComponent,
    ApartmentPhotosComponent,
    ApartmentKycComponent,
    RouterModule,
    SkeletonModule,
  ],
  templateUrl: './property-registration-page.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./property-registration-page.component.scss'],
})
export class PropertyRegistrationPageComponent
  implements OnDestroy, AfterViewInit
{
  @ViewChild('target', { static: true })
  target!: ElementRef<HTMLDivElement>;

  @ViewChild('target2', { static: true })
  target2!: ElementRef<HTMLDivElement>;

  draftData: any;
  displayActionButton: boolean = true;

  list: any = [
    {
      title: 'Tell us about your place',
      desc: 'Share some basic info, like where it is and how many guests can stay.',
      tag: 'about',
      componentNumber: [1, 2, 3, 4, 5, 6],
      done: false,
    },
    {
      title: 'Make it stand out',
      desc: 'Uploads property documents, add 5 or more photos plus a title and description.',
      tag: 'stand',
      componentNumber: [7, 8, 9, 10],
      done: false,
    },
    {
      title: 'Availability',
      desc: 'Use availability settings to customize how and when you want to host.',
      tag: 'available',
      componentNumber: [11, 12, 13],
      done: false,
    },
    {
      title: 'Finish and submit for review',
      desc: 'Set a starting price, and submit your listing.',
      tag: 'finish',
      componentNumber: [14],
      done: false,
    },
  ];

  activeList: any[] = [];
  activeNumber: number = 1;
  componentData: any;

  clickEventSubscription?: Subscription;

  constructor(
    private service: ToggleNavService,
    private router: Router,
    private _location: Location,
    private httpService: HttpService,
    private authService: AuthService
  ) {
    this.componentData = this.service.getPropertyMessage();
    this.activeList = this.list[0]?.componentNumber;

    this.clickEventSubscription = this.service
      .getSubmitPropertyClickEvent()
      .subscribe((data: any) => {
        this.nextOrBackOrSave(data);
      });

    this.getListingDraft();
  }

  verifyNext(type: string) {
    this.service.sendPropertyClickEvent({
      type: type,
      componentNumber: this.activeNumber,
    });
    this.displayActionButton = false;
  }

  nextOrBackOrSave(type?: any) {
    this.displayActionButton = true;

    // if type is save and continue
    if (type?.type == 'sc') {
      if (type?.componentNumber == 14) {
        this.service.setAccommodationMessage(this.service.getPropertyMessage());
        this.router.navigate(['/property-summary']);
        // this.router.navigate(['/host-listing']);
        this.draftData = {};
      } else if (
        type?.componentNumber == 8 &&
        (this.draftData?.status == 'published' ||
          this.draftData?.status == 'booked')
      ) {
        this.nextOrBackOrSave(type);
      } else {
        this.activeNumber = type?.componentNumber + 1;

        this.list.filter((name: any) => {
          if (type?.componentNumber >= Math.max(...name?.componentNumber)) {
            name.done = true;
          }
        });

        let activeList = this.list.find((name: any) => {
          return name?.componentNumber.includes(this.activeNumber);
        });

        this.activeList = activeList?.componentNumber;
      }
    }
    // if type is back
    else if (type?.type == 'b') {
      this.activeNumber =
        type?.componentNumber - 1 == 0 ? 1 : type?.componentNumber - 1;

      this.list.find((name: any) => {
        if (
          name?.componentNumber.includes(type?.componentNumber) &&
          type?.componentNumber >= Math.max(...name?.componentNumber)
        ) {
          name.done = false;
        }
      });

      let activeList = this.list.find((name: any) => {
        return name?.componentNumber.includes(this.activeNumber);
      });

      this.activeList = activeList?.componentNumber;
    } else if (type?.type == 'error') {
      this.displayActionButton = true;
    }
    // if type is save and exist
    else {
      if (this.draftData?.id) {
        this.service.setAccommodationMessage(this.service.getPropertyMessage());
        this.router.navigate(['/property-summary']);
      } else {
        this.router.navigate(['/host-listing']);
      }
      this.draftData = {};
    }
  }

  nextOrBackOrSave2(type?: string) {
    this.target?.nativeElement?.scrollIntoView();
    this.target2?.nativeElement?.scrollIntoView();

    if (this.activeNumber == 1 && type == 'b') {
      this._location.back();
    } else {
      this.nextOrBackOrSave({ type: type, componentNumber: this.activeNumber });
    }
  }

  getListingDraft() {
    const accommodationMessage: any = this.service.getAccommodationMessage();
    const propertyMessage: any = this.service.getPropertyMessage();

    if (accommodationMessage?.stepType && propertyMessage?.stepType) {
      this.draftData = accommodationMessage;
      this.activeNumber = accommodationMessage?.step;

      this.list.filter((name: any) => {
        if (this.activeNumber >= Math.max(...name?.componentNumber)) {
          name.done = true;
        }
      });
    } else {
      this.httpService.getAuthSingle(baseUrl.draft).subscribe(
        (data: any) => {
          this.service.setAccommodationMessage(undefined);
          this.service.setPropertyMessage(undefined);
          this.service.accommodationMessage = undefined;
          this.service.propertyMessage = undefined;
          this.draftData = {};

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
              data?.data?.has_advance_verification == 0 ? false : true,
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

          this.draftData = sampleData;
          this.service.setPropertyMessage(sampleData);
          this.activeNumber = data?.data?.step;

          this.list.filter((name: any) => {
            if (this.activeNumber >= Math.max(...name?.componentNumber)) {
              name.done = true;
            }
          });
        },
        () => {
          this.service.setAccommodationMessage(undefined);
          this.service.setPropertyMessage(undefined);
          this.service.accommodationMessage = undefined;
          this.service.propertyMessage = undefined;
          this.activeNumber = 1;
          this.draftData = {};
        }
      );
    }
  }

  ngOnDestroy() {
    this.draftData = {};
  }

  ngAfterViewInit(): void {
    this.authService.checkExpired();
  }
}
