import { CommonModule, DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { baseUrl } from '../../../../../environments/environment';
import { AuthService } from '../../../../global-services/auth.service';
import { HttpService } from '../../../../global-services/http.service';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-filter-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './filter-dialog.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./filter-dialog.component.scss'],
})
export class FilterDialogComponent implements AfterViewInit, OnInit {
  @Input() data: any;
  @ViewChild('fform') feedbackFormDirective: any;
  feedbackForm: any = FormGroup;
  @Input() adressType: any;
  @Output() setAddress: EventEmitter<any> = new EventEmitter();
  @ViewChild('addresstext') addresstext: any;
  address: any;
  travelSmsNotification: boolean = false;
  bedroomNumber: string = '';
  bathroomNumber: string = '';
  amenities: any[] = [];

  bookingOptions: any[] = [
    {
      title: 'Instant Book',
      subTitle: 'Listings you can book without waiting for Host approval',
      value: false,
      tag: 'is_instant_bookable',
    },
  ];

  placeType: any[] = [
    {
      title: 'An entire place',
      subTitle: 'Guests have the whole place to themselves.',
      img: 'property-home-icon.svg',
      tag: 'entire_place',
      value: false,
    },
    {
      title: 'A room',
      subTitle:
        'Guests have their own room in a home, plus access to shared spaces.',
      img: 'property-home2-icon.svg',
      tag: 'a_room',
      value: false,
    },
    {
      title: 'A shared room',
      subTitle:
        'Guests sleep in a room or common area that may be shared with you or others',
      img: 'property-home3-icon.svg',
      tag: 'shared_room',
      value: false,
    },
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogComponent>,
    private datepipe: DatePipe,
    private service: ToggleNavService,
    private httpService: HttpService
  ) {
    this.createForm();
    this.authService.checkExpired();

    let amenities: any = this.service.getAmenitiesMessage();
    if (!amenities) {
      this.getAmenities();
    } else {
      amenities.filter((n: any) =>
        this.amenities.push({ name: n?.name, value: false, uuid: n?.uuid })
      );
    }
  }

  ngAfterViewInit() {
    this.getPlaceAutocomplete();
  }

  changeActive(uuid: string) {
    this.amenities.find((n: any) => {
      if (n?.uuid == uuid) {
        n.value = !n.value;
      }
    });
  }

  clearFilter() {
    this.feedbackFormDirective.resetForm();
    this.address = undefined;
    this.bedroomNumber = '';
    this.bathroomNumber = '';
    this.closeDialog({ clear: true });
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      min: [''],
      state: [''],
      search: [''],
      max: [''],
      date: [''],
    });
  }

  sendForSearch() {
    let filterObject = {};

    if (this.feedbackForm.value.search) {
      Object.assign(filterObject, {
        'filter[title]': this.feedbackForm.value.search,
      });
    }

    if (this.feedbackForm.value?.state || this.address) {
      Object.assign(filterObject, {
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

    if (this.feedbackForm.value.min) {
      Object.assign(filterObject, {
        'filter[min_price]': this.feedbackForm.value.min,
      });
    }

    if (this.feedbackForm.value.max) {
      Object.assign(filterObject, {
        'filter[max_price]': this.feedbackForm.value.max,
      });
    }

    if (this.feedbackForm.value.date) {
      Object.assign(filterObject, {
        'filter[available_from]': this.datepipe.transform(
          this.feedbackForm.value.date,
          'YYYY-MM-dd'
        ),
      });
    }

    Object.assign(filterObject, {
      'filter[is_instant_bookable]':
        this.bookingOptions[0]?.value == true ? 1 : 0,
    });

    if (this.amenities.find((n: any) => n?.value == true)) {
      let uuid: any[] = [];

      this.amenities.filter((n: any) => {
        if (n?.value == true) {
          uuid.push(n?.uuid);
        }
      }),
        Object.assign(filterObject, {
          'filter[amenities]': uuid,
        });
    }

    this.closeDialog(filterObject);
  }

  private getPlaceAutocomplete() {
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

  invokeEvent(place: any) {
    this.address = place;
    this.setAddress.emit(place);
  }

  closeDialog(data: any) {
    this.dialogRef.close({
      loading: true,
      data: { object: data },
    });
  }

  getAmenities() {
    this.httpService.getSingleNoAuth(baseUrl.amenities).subscribe(
      (data: any) => {
        for (let n of data?.data) {
          this.amenities.push({ name: n?.name, value: false, uuid: n?.uuid });
        }

        this.service.setAmenitiestMessage(data?.data);
      },
      (err) => {}
    );
  }

  ngOnInit(): void {
    if (this.data?.data.hasOwnProperty('filter[available_from]')) {
      this.feedbackForm.patchValue({
        date: this.data?.data['filter[available_from]'],
      });
    }

    if (this.data?.data.hasOwnProperty('filter[title]')) {
      this.feedbackForm.patchValue({
        search: this.data?.data['filter[title]'],
      });
    }

    if (this.data?.data.hasOwnProperty('filter[is_instant_bookable]')) {
      this.bookingOptions[0].value =
        this.data?.data['filter[is_instant_bookable]'] == 1 ? true : false;
    }

    this.address = {};

    if (this.data?.data.hasOwnProperty('filter[state]')) {
      Object.assign(this.address, {
        state: this.data?.data['filter[state]'],
      });
    }

    if (this.data?.data.hasOwnProperty('filter[country]')) {
      Object.assign(this.address, {
        country: this.data?.data['filter[country]'],
      });
    }

    if (this.data?.data.hasOwnProperty('filter[city]')) {
      Object.assign(this.address, {
        city: this.data?.data['filter[city]'],
      });
    }
  }
}
