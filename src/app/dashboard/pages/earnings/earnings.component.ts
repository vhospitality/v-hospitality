import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
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
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { SkeletonModule } from 'primeng/skeleton';
import {
  Observable,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  startWith,
  tap,
} from 'rxjs';
import { baseUrl } from '../../../../environments/environment';
import { AuthService } from '../../../global-services/auth.service';
import { HttpService } from '../../../global-services/http.service';
import { BackButtonComponent } from '../../components/back-button/back-button.component';
import { EarningsTableComponent } from '../../components/earnings-component/earnings-table/earnings-table.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { LineChartComponent } from '../../components/line-chart/line-chart.component';
import { ToggleNavService } from '../../dashboard-service/toggle-nav.service';

@Component({
  selector: 'app-earnings',
  standalone: true,
  imports: [
    CommonModule,
    EarningsTableComponent,
    HeaderComponent,
    FooterComponent,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DropdownModule,
    MatButtonModule,
    MatMenuModule,
    LineChartComponent,
    MatAutocompleteModule,
    SkeletonModule,
    RouterModule,
    BackButtonComponent,
  ],
  templateUrl: './earnings.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./earnings.component.scss'],
})
export class EarningsComponent implements AfterViewInit {
  @ViewChild('input') input: ElementRef | any;
  @ViewChild('fform') feedbackFormDirective: any;
  feedbackForm: any = FormGroup;
  userData: any;
  chartData: any;
  earningsMonth: any[] = [
    {
      month: 'This year',
      code: 'year',
    },
    {
      month: 'This month',
      code: 'month',
    },
    {
      month: 'This week',
      code: 'week',
    },
    {
      month: 'Today',
      code: 'today',
    },
  ];
  earningsMonthActive: any;
  filterObject: any = {};
  loadingStat: boolean = false;
  loadingListing: boolean = false;
  options: any[] = [];
  filteredOptions: Observable<any[]> | any;
  datas: any;

  clickEventSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private service: ToggleNavService,
    private httpService: HttpService
  ) {
    this.createForm();
    this.loadData();

    this.clickEventSubscription = this.service
      .getIsLoginClickEvent()
      .subscribe(() => {
        this.userData = this.service.getProfileMessage();
      });

    this.userData = this.service.getProfileMessage();
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      listing: [''],
      startDate2: [''],
      endDate2: [''],
    });
  }

  loadData(option?: any) {
    this.loadingStat = true;
    this.filterObject = {};

    if (this.feedbackForm.value.listing || option?.uuid) {
      this.feedbackForm.patchValue({
        listing: option || this.feedbackForm.value.listing,
      });

      Object.assign(this.filterObject, {
        'filter[listing]':
          this.feedbackForm.value.listing?.uuid || option?.uuid,
      });
    }

    if (this.earningsMonthActive) {
      Object.assign(this.filterObject, {
        'filter[created_at]': this.earningsMonthActive?.code,
      });
    }

    let url = new URLSearchParams(this.filterObject).toString();

    this.httpService
      .getAuthSingle(baseUrl.earnings + `/analytics/?${url}`)
      .subscribe(
        (data: any) => {
          this.datas = data?.data;
          this.chartData = {
            leftText: 'Amount (₦)',
            data: {
              categories: data?.data?.analytics.map((element: any) => {
                return (
                  element?.time ||
                  element?.month ||
                  element?.today ||
                  element?.week ||
                  element?.year ||
                  element?.day
                );
              }),
              second: {
                year: '2023',
                data: data?.data?.analytics.map((element: any) => {
                  return [element?.total_amount, false];
                }),
              },
            },
          };
          this.loadingStat = false;
        },
        () => {
          this.authService.checkExpired();
          this.loadingStat = false;
        }
      );
  }

  autoFillListing() {
    this.filteredOptions = this.feedbackForm.get('listing').valueChanges.pipe(
      startWith(''),
      map((value: any) => {
        const name = typeof value === 'string' ? value : value?.title;
        return name
          ? this._filter(name as string)
          : this.options?.slice() || name;
      })
    );
  }

  searchListing(search: string) {
    this.loadingListing = true;
    let filterObject = {};
    if (this.feedbackForm.value.listing) {
      Object.assign(filterObject, {
        'filter[title]': search,
      });
    }

    let url = new URLSearchParams(filterObject).toString();

    this.httpService
      .getAuthSingle(
        baseUrl.hostListing +
          `/?per_page=50&page=1&fields[listings]=uuid,title&${url}`
      )
      .subscribe(
        (data: any) => {
          this.loadingListing = false;
          this.options = data?.data?.data;
          this.autoFillListing();
        },
        (err) => {
          this.loadingListing = false;
          this.options = [];
        }
      );
  }

  displayFn(listings: any): string {
    return listings && listings.title ? listings.title : '';
  }

  private _filter(name: string) {
    const filterValue = name.toLowerCase();

    return this.options.filter((option) =>
      option.title.toLowerCase().includes(filterValue)
    );
  }

  selectMonthActive(m: any): void {
    this.earningsMonthActive = m;
    this.loadData();
  }

  ngAfterViewInit() {
    this.authService.checkExpired();

    fromEvent(this.input.nativeElement || '', 'keyup')
      .pipe(
        filter(Boolean),
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          this.searchListing(this.input.nativeElement.value);
        })
      )
      .subscribe();
  }
}
