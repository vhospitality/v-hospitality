import { CommonModule, DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
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
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { baseUrl } from '../../../../environments/environment';
import { AuthService } from '../../../global-services/auth.service';
import { HttpService } from '../../../global-services/http.service';
import { BackButtonComponent } from '../../components/back-button/back-button.component';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-guest-booking',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DropdownModule,
    CalendarModule,
    MatButtonModule,
    TableModule,
    MatMenuModule,
    RouterModule,
    BackButtonComponent,
  ],
  templateUrl: './guest-booking.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./guest-booking.component.scss'],
})
export class GuestBookingComponent implements AfterViewInit {
  @ViewChild('fform') feedbackFormDirective: any;
  feedbackForm: any = FormGroup;
  reservations: any[] = [];
  loading: boolean = true;
  activityValues: number[] = [0, 100];
  total = 0;
  perPage = 15;
  filterObject: any = {};
  paymentStatus: any = [
    { viewValue: 'Pending', value: 'pending' },
    { viewValue: 'Failed', value: 'failed' },
    { viewValue: 'Success', value: 'success' },
  ];
  bookingStatus: any = [
    { viewValue: 'Pending', value: 'pending' },
    { viewValue: 'Declined', value: 'declined' },
    { viewValue: 'Accepted', value: 'accepted' },
    { viewValue: 'Checked in', value: 'check_in' },
    { viewValue: 'Checked out', value: 'checked_out' },
  ];
  pageEvent: any;

  constructor(
    private dialog: MatDialog,
    private httpService: HttpService,
    private authService: AuthService,
    private fb: FormBuilder,
    private datepipe: DatePipe,
    private direct: ActivatedRoute
  ) {
    this.createForm();
    this.paginateLoadData();

    this.direct.queryParamMap.subscribe((params: any) => {
      if (params?.params?.trxref || params?.params?.reference) {
        this.openDialog({
          reference: params?.params?.trxref || params?.params?.reference,
          message:
            'You have just made a payment, would you like to save card for subsequent payments?',
          requestType: 'success-error',
          title: 'Save card details',
          requestMessage: '',
          type: 'card',
        });
      }
    });
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      search: [''],
      date: [''],
      payment_status: [''],
      booking_status: [''],
      booking_code: [''],
    });
  }

  paginateLoadData(event?: any) {
    this.loading = true;
    this.reservations = [];
    this.filterObject = {};
    const get_current_page = event?.first + this.perPage || this.perPage;
    this.pageEvent = event;

    if (this.feedbackForm.value.search) {
      Object.assign(this.filterObject, {
        'filter[listing]': this.feedbackForm.value.search,
      });
    }

    if (this.feedbackForm.value.booking_status) {
      Object.assign(this.filterObject, {
        'filter[status]': this.feedbackForm.value.booking_status,
      });
    }

    if (this.feedbackForm.value.payment_status) {
      Object.assign(this.filterObject, {
        'filter[payment_status]': this.feedbackForm.value.payment_status,
      });
    }

    if (this.feedbackForm.value.date) {
      Object.assign(this.filterObject, {
        'filter[created_at]': this.datepipe.transform(
          this.feedbackForm.value.date,
          'YYYY-MM-dd'
        ),
      });
    }

    if (this.feedbackForm.value.booking_code) {
      Object.assign(this.filterObject, {
        'filter[booking_code]': this.feedbackForm.value.booking_code,
      });
    }

    let url = new URLSearchParams(this.filterObject).toString();

    this.httpService
      .getAuthSingle(
        baseUrl.bookings +
          `/?per_page${
            this.perPage
          }&include=listing&fields[listing.host]=first_name,last_name&fields[bookings]=uuid,booking_code,reason_for_decline,check_in,check_out,status,payment_status,guests,created_at&fields[listing]=uuid,is_instant_bookable,pictures,title,description,occupancy_taxes,price_per_night,cleaning_fee&page=${
            get_current_page / this.perPage
          }&${url}`
      )
      .subscribe(
        (data: any) => {
          this.loading = false;
          this.reservations = data?.data?.data;
          this.total = data?.data?.total;
        },
        () => {
          this.authService.checkExpired();
          this.loading = false;
          this.total = 0;
          this.reservations = [];
        }
      );
  }

  openDialog(data: any) {
    this.dialog.closeAll();
    let dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: 'dialog',
        data: data,
      },
    });

    // after dialog close
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.loading) {
        this.paginateLoadData(this.pageEvent);
      }
    });
  }

  getNumberOfNight(checkinDate: string, checkoutDate: string) {
    const date1: any = new Date(checkinDate);
    const date2: any = new Date(checkoutDate);
    date1.setHours(0, 0, 0, 0);
    date2.setHours(0, 0, 0, 0);

    const diffTime1 = Math.abs(date2 - date1);
    const diffDays1 = Math.floor(diffTime1 / (1000 * 60 * 60 * 24));
    return diffDays1 < 1 ? 1 : diffDays1;
  }

  getTaxAmount(data: any) {
    const tax = data?.payment_breakdown?.tax / 100;
    const nightPrice =
      data?.listing?.price_per_night *
      this.getNumberOfNight(data?.check_in, data?.check_out);
    const amount = nightPrice + this.getServiceChargeAmount(data);
    return amount * tax;
  }

  getServiceChargeAmount(data: any) {
    const tax = data?.payment_breakdown?.service_fee / 100;
    const serviceCharge =
      data?.listing?.price_per_night *
      this.getNumberOfNight(data?.check_in, data?.check_out);
    return serviceCharge * tax;
  }

  getTotalGuest(reservation: any) {
    return (
      Number(reservation?.infants) +
      Number(reservation?.children) +
      Number(reservation?.adults)
    );
  }

  getTotalAmount(data: any) {
    const tax = this.getTaxAmount(data);
    const service_fee = this.getServiceChargeAmount(data);
    const nightPrice =
      data?.listing?.price_per_night *
      this.getNumberOfNight(data?.check_in, data?.check_out);
    const total = nightPrice + service_fee + tax;
    return total;
  }

  clearFilter() {
    this.feedbackFormDirective.resetForm();
    this.paginateLoadData();
  }

  splitBookingStatus(status: string) {
    let splitText = status.split('_');
    if (splitText.length > 1) {
      return splitText[0] + ' ' + splitText[1];
    } else {
      return status;
    }
  }

  ngAfterViewInit() {
    this.authService.checkExpired();
  }
}
