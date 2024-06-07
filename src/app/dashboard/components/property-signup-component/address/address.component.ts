import { CommonModule, isPlatformBrowser } from '@angular/common';
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
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { baseUrl } from '../../../../../environments/environment';
import { AuthService } from '../../../../global-services/auth.service';
import { HttpService } from '../../../../global-services/http.service';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';
import { MapComponent } from '../../map/map.component';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatAutocompleteModule,
    MapComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './address.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./address.component.scss'],
})
export class AddressComponent implements AfterViewInit {
  @Input() adressType: any;
  @Output() setAddress: EventEmitter<any> = new EventEmitter();
  @ViewChild('addresstext') addresstext: any;
  map: any;

  @Input() componentData: any;
  @ViewChild('fform') feedbackFormDirective: any;
  feedbackForm: any = FormGroup;
  loading: boolean = false;
  disabled: boolean = false;
  error: string = '';
  dataToSend: any;
  componentNumber: number = 5;
  address: any;

  states: any = [{ name: 'Abuja' }, { name: 'Lagos' }, { name: 'Kogi' }];
  cities: any = [{ name: 'Binin' }, { name: 'Jeba' }, { name: 'Minna' }];

  formErrors: any = {
    address: '',
    suite: '',
    // state: '',
    city: '',
    zip: '',
  };

  validationMessages: any = {
    address: {
      required: 'Required.',
    },
    suite: {
      required: 'Required.',
    },
    state: {
      required: 'Required.',
    },
    city: {
      required: 'Required.',
    },
    zip: {
      required: 'Required.',
    },
  };

  clickEventSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private service: ToggleNavService,
    private httpService: HttpService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.createForm();

    this.authService.checkExpired();

    this.clickEventSubscription = this.service
      .getPropertyClickEvent()
      .subscribe((data: any) => {
        this.onSubmit(data);
      });

    let data: any = this.service.getPropertyMessage();

    if (data?.address) {
      this.address = data?.address;
      this.feedbackForm.patchValue({
        city: data?.address?.address,
      });

      this.map = undefined;
      if (data?.address?.latitude) {
        this.map = [
          {
            latitude: data?.address?.latitude,
            longitude: data?.address?.longitude,
          },
        ];
      }
    }
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      city: ['', [Validators.required]],
    });

    this.feedbackForm.valueChanges.subscribe(() => this.onValueChanged());
    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged() {
    if (!this.feedbackForm) {
      return;
    }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit(type: any) {
    if (this.address) {
      if (type?.componentNumber == this.componentNumber) {
        this.onValueChanged();
        const feed = this.feedbackFormDirective.invalid;
        if (feed) {
        } else {
          this.dataToSend = {
            street_address:
              this.address?.formatted_address || this.address?.address,
            address: this.address?.formatted_address || this.address?.address,
            apt_suite: `Apt. ${
              this.address?.plus_code?.global_code || this.address?.suite || ''
            }`,
            suite: `Apt. ${
              this.address?.plus_code?.global_code || this.address?.suite || ''
            }`,
            city:
              this.address?.address_components?.find(
                (n: any) =>
                  n?.types.includes('sublocality') ||
                  n?.types.includes('neighborhood') ||
                  n?.types.includes('administrative_area_level_2') ||
                  n?.types.includes('administrative_area_level_3') ||
                  n?.types.includes('postal_town')
              )?.long_name ||
              this.address?.city ||
              '',
            state:
              this.address?.address_components?.find(
                (n: any) =>
                  n?.types.includes('locality') ||
                  n?.types.includes('administrative_area_level_1')
              )?.long_name ||
              this.address?.state ||
              '',
            zipcode:
              this.address?.address_components?.find((n: any) =>
                n?.types.includes('postal_code')
              )?.long_name ||
              this.address?.zip ||
              '',
            zip:
              this.address?.address_components?.find((n: any) =>
                n?.types.includes('postal_code')
              )?.long_name ||
              this.address?.zip ||
              '',
            country:
              this.address?.address_components?.find((n: any) =>
                n?.types.includes('country')
              )?.long_name ||
              this.address?.country ||
              '',
            latitude: `${
              this.address?.geometry?.location?.lat() || this.address?.latitude
            }`,
            longitude: `${
              this.address?.geometry?.location?.lng() || this.address?.longitude
            }`,
            step: this.componentNumber,
          };

          this.updateData(type);
        }
      }
    } else {
      this.error = 'Invalid address';
      this.service.sendSubmitPropertyClickEvent({
        type: 'error',
      });
    }
  }

  updateData(type: any) {
    this.loading = true;

    let data: any = this.service.getPropertyMessage();

    this.httpService
      .updateData(
        data?.id
          ? baseUrl.draft + '/' + data?.id
          : baseUrl.listing + '/' + data?.uuid,
        this.dataToSend
      )
      .subscribe(
        () => {
          this.loading = false;
          let data: any = this.service.getPropertyMessage();

          Object.assign(data, {
            address: this.dataToSend,
          });

          this.service.setPropertyMessage(data);
          this.service.sendSubmitPropertyClickEvent({
            type: type?.type,
            componentNumber: this.componentNumber,
          });
        },
        (err) => {
          this.loading = false;
          this.error =
            err?.error?.message ||
            err?.error?.msg ||
            err?.error?.detail ||
            'An error occured, please try again';

          this.service.sendSubmitPropertyClickEvent({
            type: 'error',
          });
        }
      );
  }

  ngAfterViewInit() {
    this.getPlaceAutocomplete();
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
    this.map = undefined;
    setTimeout(() => {
      this.map = [
        {
          latitude: place?.geometry?.location?.lat(),
          longitude: place?.geometry?.location?.lng(),
        },
      ];
    }, 2000);
    this.setAddress.emit(place);
  }
}
