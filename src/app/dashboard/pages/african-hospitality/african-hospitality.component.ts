import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  Output,
  PLATFORM_ID,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { GalleriaModule } from 'primeng/galleria';
import { InputTextModule } from 'primeng/inputtext';
import { Subscription } from 'rxjs';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { ApartmentsComponent } from '../../components/landing-page-component/apartments/apartments.component';
import { SelectOptionComponent } from '../../components/select/select-option/select-option.component';
import { SelectComponent } from '../../components/select/select.component';
import { SelectService } from '../../components/select/select.service';
import { ToggleNavService } from '../../dashboard-service/toggle-nav.service';

@Component({
  selector: 'app-african-hospitality',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    CalendarModule,
    ApartmentsComponent,
    SelectComponent,
    SelectOptionComponent,
    HeaderComponent,
    FooterComponent,
    InputTextModule,
    GalleriaModule,
    LazyLoadImageModule,
  ],
  templateUrl: './african-hospitality.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  // providers: [{ provide: LAZYLOAD_IMAGE_HOOKS, useClass: LazyLoadImageHooks }],
  styleUrls: ['./african-hospitality.component.scss'],
})
export class AfricanHospitalityComponent implements OnDestroy {
  @Input() adressType: any;
  @Output() setAddress: EventEmitter<any> = new EventEmitter();
  @ViewChild('addresstext') addresstext: any;
  address: any;
  minimumDate = new Date();

  checkinDate: any;
  selectOption: any[] = [
    {
      id: 1,
      gender: 'Adult',
      desc: 'Ages 18 or above',
      total: 0,
    },
    {
      id: 2,
      gender: 'Children',
      desc: 'Ages 2 - 17',
      total: 0,
    },
    {
      id: 3,
      gender: 'Infant',
      desc: 'Under 2',
      total: 0,
    },
  ];

  datas: any[] = [
    {
      imgName: '/assets/images/5-bg.jpg',
    },
    {
      imgName: '/assets/images/5-bg.png',
    },
    {
      imgName: '/assets/images/3-bg.jpg',
    },
    {
      imgName: '/assets/images/4-bg.jpg',
    },
    {
      imgName: '/assets/images/third-swipper.jpg',
    },
  ];

  value?: string;
  clickEventSubscription?: Subscription;

  constructor(
    private sharedSelect: SelectService,
    private router: Router,
    private service: ToggleNavService,
    private dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.clickEventSubscription = this.sharedSelect
      .getSelectClickEvent()
      .subscribe((data: any) => {
        let findId = this.selectOption.findIndex((x) => x?.id === data?.id);

        if (data?.type === 'add') {
          this.selectOption[findId].total += 1;
          if (
            this.selectOption[findId].total > 1 &&
            this.selectOption[findId].id !== 2 &&
            !this.selectOption[findId]?.gender.endsWith('s')
          ) {
            this.selectOption[findId].gender += 's';
          }
        } else if (data?.type === 'minus') {
          if (this.selectOption[findId].total < 1) {
            this.selectOption[findId].total = 0;
            if (this.selectOption[findId]?.gender.endsWith('s')) {
              this.selectOption[findId].gender = this.selectOption[
                findId
              ].gender.slice(0, -1);
            }
          } else {
            this.selectOption[findId].total -= 1;
            if (
              this.selectOption[findId].total > 1 &&
              this.selectOption[findId].id !== 2 &&
              !this.selectOption[findId]?.gender.endsWith('s')
            ) {
              this.selectOption[findId].gender += 's';
            } else if (
              this.selectOption[findId]?.gender.endsWith('s') &&
              this.selectOption[findId].total < 2
            ) {
              this.selectOption[findId].gender = this.selectOption[
                findId
              ].gender.slice(0, -1);
            }
          }
        }

        this.sharedSelect.setSelectMessage(this.selectOption);
      });

    const serviceData: any = this.service.getAccommodationMessage() || {};

    // let selectOption = [
    //   {
    //     id: 1,
    //     gender: 'Adults',
    //     desc: 'Ages 18 or above',
    //     total:
    //       serviceData?.selectOption?.find((n: any) => n?.id === 1)?.total || 0,
    //   },
    //   {
    //     id: 2,
    //     gender: 'Children',
    //     desc: 'Ages 2 - 17',
    //     total:
    //       serviceData?.selectOption?.find((n: any) => n?.id === 2)?.total || 0,
    //   },
    //   {
    //     id: 3,
    //     gender: 'Infants',
    //     desc: 'Under 2',
    //     total:
    //       serviceData?.selectOption?.find((n: any) => n?.id === 3)?.total || 0,
    //   },
    // ];

    // this.selectOption = selectOption;

    let selectOption = [
      {
        id: 1,
        gender: 'Adult',
        desc: 'Ages 18 or above',
        total: 0,
      },
      {
        id: 2,
        gender: 'Children',
        desc: 'Ages 2 - 17',
        total: 0,
      },
      {
        id: 3,
        gender: 'Infant',
        desc: 'Under 2',
        total: 0,
      },
    ];

    this.selectOption = selectOption;
    this.sharedSelect.setSelectMessage(selectOption);
  }

  search() {
    this.service.setAccommodationMessage({
      selectOption: this.selectOption,
      country: this.address,
      date: this.checkinDate,
    });
    this.router.navigate(['/accommodations']);
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
    this.setAddress.emit(place);
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

  ngOnDestroy(): void {
    this.clickEventSubscription?.unsubscribe();
  }
}
