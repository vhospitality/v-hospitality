import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { Subscription } from 'rxjs';
import { baseUrl } from '../../../../../environments/environment';
import { AuthService } from '../../../../global-services/auth.service';
import { HttpService } from '../../../../global-services/http.service';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';
import { DialogComponent } from '../../dialog/dialog.component';
import { SelectOptionComponent } from '../../select/select-option/select-option.component';
import { SelectComponent } from '../../select/select.component';
import { SelectService } from '../../select/select.service';

@Component({
  selector: 'app-accommodation-detail-form',
  standalone: true,
  imports: [
    CommonModule,
    SelectComponent,
    SelectOptionComponent,
    CalendarModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './accommodation-detail-form.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./accommodation-detail-form.component.scss'],
})
export class AccommodationDetailFormComponent implements OnDestroy, OnInit {
  @Input() data: any;
  checkinDate: any;
  checkoutDate: any;
  minimumDate = new Date();
  pass_verification: boolean = false;
  disabledDates: Date[] = [];

  selectOption: any[] = [];

  loading: boolean = false;
  userData: any;
  isLogin: boolean;
  serviceData: any = {};
  is_valid: boolean = false;

  numberGuestError = 'Please add number of guests';
  dateError?: string;
  guestError?: string;

  clickEventSubscription?: Subscription;
  clickEventSubscription2?: Subscription;

  constructor(
    private sharedSelect: SelectService,
    private dialog: MatDialog,
    private authService: AuthService,
    private service: ToggleNavService,
    private httpService: HttpService,
    private datepipe: DatePipe,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.clickEventSubscription = this.sharedSelect
      .getSelectClickEvent()
      .subscribe((data: any) => {
        let findId = this.selectOption?.findIndex((x) => x?.id === data?.id);

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
        this.validateBooking2();
      });

    this.clickEventSubscription2 = this.service
      .getIsLoginClickEvent()
      .subscribe(() => {
        this.userData = this.service.getProfileMessage();
      });

    this.isLogin = this.authService.isLoggedIn();

    if (!this.userData) {
      this.getProfileDetails();
    }

    // this.serviceData = this.service.getAccommodationMessage() || {};

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

    // this.checkinDate =
    //   this.serviceData?.date?.length > 0
    //     ? this.serviceData?.date[0]
    //     : undefined;

    // this.checkoutDate =
    //   this.serviceData?.date?.length > 1
    //     ? this.serviceData?.date[1]
    //     : undefined;
  }

  validateDate() {
    if (!this.checkinDate || !this.checkoutDate) {
      this.dateError = 'Please select Check in and Check out date';
    } else {
      const date1: any = new Date(this.checkinDate);
      const date2: any = new Date(this.checkoutDate);
      const diffTime = date2 - date1;

      if (
        Math.sign(diffTime) == 1 &&
        this.getNumberOfNight() >= this.data?.minimum_nights &&
        this.getNumberOfNight() <= this.data?.maximum_nights
      ) {
        this.dateError = undefined;
      } else {
        this.dateError = `Minimum night is ${this.data?.minimum_nights} and maximum night is ${this.data?.maximum_nights}`;
      }
    }
  }

  validateGuest() {
    const total = this.getTotalGuest();
    if (total <= 0 || Number.isNaN(total)) {
      this.guestError = this.numberGuestError;
    } else {
      if (total > this.data?.no_of_guests) {
        this.guestError = `Maximum guest is ${this.data?.no_of_guests}`;
      } else if (this.getTotalAdult() < 1) {
        this.guestError = `Please select at lease one(1) adult`;
      } else {
        this.guestError = undefined;
      }
    }
  }

  getTotalGuest() {
    return (
      this.selectOption?.find((n: any) => n?.id === 1)?.total +
      this.selectOption?.find((n: any) => n?.id === 2)?.total +
      this.selectOption?.find((n: any) => n?.id === 3)?.total
    );
  }

  getTotalAdult() {
    return this.selectOption?.find((n: any) => n?.id === 1)?.total;
  }

  getNumberOfNight() {
    const date1: any = new Date(this.checkinDate);
    const date2: any = new Date(this.checkoutDate);

    date1.setHours(0, 0, 0, 0);
    date2.setHours(0, 0, 0, 0);

    const diffTime1 = Math.abs(date2 - date1);
    const diffDays1 = Math.floor(diffTime1 / (1000 * 60 * 60 * 24));
    return diffDays1 < 1 ? 1 : diffDays1;
  }

  getTaxAmount(data: any) {
    const tax = (data?.payment_breakdown?.tax || data?.occupancy_taxes) / 100;
    const nightPrice =
      data?.price_per_night *
      (this.getNumberOfNight() || this.data?.minimum_nights);
    const amount = nightPrice + this.getServiceChargeAmount(data);
    return amount * tax;
  }

  getServiceChargeAmount(data: any) {
    const tax = (data?.payment_breakdown?.service_fee || 6) / 100;
    const serviceCharge =
      data?.price_per_night *
      (this.getNumberOfNight() || this.data?.minimum_nights);
    return serviceCharge * tax;
  }

  getTotalAmount() {
    const tax = this.getTaxAmount(this.data);
    const service_fee = this.getServiceChargeAmount(this.data);
    const nightPrice =
      this.data?.price_per_night *
      (this.getNumberOfNight() || this.data?.minimum_nights);
    const total = nightPrice + service_fee + tax;
    return total;
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

  getProfileDetails() {
    if (this.isLogin) {
      this.httpService.getAuthSingle(baseUrl.profileDetails).subscribe(
        (data: any) => {
          this.userData = data?.data;
          this.service.setProfileMessage(data?.data);
          if (this.loading) {
            this.validateBooking();
            this.loading = false;
          }
          this.loading = false;
        },
        () => {
          this.loading = false;
          this.authService.checkExpired();
        }
      );
    }
  }

  configurePaymentData() {
    return {
      listing_uuid: this.data?.uuid,
      check_in: this.datepipe.transform(this.checkinDate, 'YYYY-MM-dd'),
      check_out: this.datepipe.transform(this.checkoutDate, 'YYYY-MM-dd'),
      no_of_guests: this.getTotalGuest(),
      uuid: this.userData?.uuid,
      guests: {
        adults: this.selectOption?.find((n: any) => n?.id === 1)?.total || 0,
        children: this.selectOption?.find((n: any) => n?.id === 2)?.total || 0,
        infants: this.selectOption?.find((n: any) => n?.id === 3)?.total || 0,
      },
      listing: this.data,
      email: this.userData?.email,
      host: this.data?.host,
      total: this.getTotalAmount(),
      type: 'booking',
    };
  }

  validateBooking2() {
    this.validateGuest();
    this.validateDate();
  }

  validateBooking() {
    this.userData = this.service.getProfileMessage();
    this.isLogin = this.authService.isLoggedIn();

    this.validateGuest();
    this.validateDate();

    if (!this.isLogin) {
      this.openDialog('', 'login2');
    }

    if (this.isLogin && !this.userData) {
      this.loading = true;
      this.getProfileDetails();
    }

    if (
      this.data?.has_advance_verification === 1 &&
      this.userData?.is_advanced_verified === 0
    ) {
      this.dialog.closeAll();
      this.dialog.open(DialogComponent, {
        data: {
          type: 'dialog',
          data: {
            requestType: 'upload',
            requestMessage: 'Please verify your identity',
            data: '',
          },
        },
      });
    } else {
      this.pass_verification = true;
    }

    if (
      !this.dateError &&
      this.isLogin &&
      this.userData &&
      !this.guestError &&
      this.pass_verification
    ) {
      this.guestError = undefined;
      this.dateError = undefined;
      this.createBooking();
    }
  }

  requestToBook() {
    this.loading = true;

    const dataToSend = {
      amount: this.getTotalAmount(),
      check_in: this.datepipe.transform(this.checkinDate, 'YYYY-MM-dd'),
      check_out: this.datepipe.transform(this.checkoutDate, 'YYYY-MM-dd'),
      no_of_guests: this.getTotalGuest(),
      guests: {
        adults: this.selectOption?.find((n: any) => n?.id === 1)?.total || 0,
        children: this.selectOption?.find((n: any) => n?.id === 2)?.total || 0,
        infants: this.selectOption?.find((n: any) => n?.id === 3)?.total || 0,
      },
    };

    this.httpService
      .postData(`${baseUrl.listing}/${this.data?.uuid}/requests`, dataToSend)
      .subscribe(
        () => {
          this.loading = false;
          this.viewRequestToBook();
        },
        (err) => {
          this.loading = false;
          this.snackBar.open(
            err?.error?.message ||
              err?.error?.msg ||
              err?.error?.detail ||
              err?.error?.status ||
              'An error occured!',
            'x',
            {
              duration: 5000,
              panelClass: 'error',
              horizontalPosition: 'center',
              verticalPosition: 'top',
            }
          );
        }
      );
  }

  configurePaymentOption(data: any) {
    Object.assign(data, this.configurePaymentData());
    this.openDialog(data, 'card');
  }

  createBooking() {
    this.loading = true;

    const dataToSend = {
      listing_uuid: this.data?.uuid,
      amount: this.getTotalAmount(),
      check_in: this.datepipe.transform(this.checkinDate, 'YYYY-MM-dd'),
      check_out: this.datepipe.transform(this.checkoutDate, 'YYYY-MM-dd'),
      no_of_guests: this.getTotalGuest(),
      guests: {
        adults: this.selectOption?.find((n: any) => n?.id === 1)?.total || 0,
        children: this.selectOption?.find((n: any) => n?.id === 2)?.total || 0,
        infants: this.selectOption?.find((n: any) => n?.id === 3)?.total || 0,
      },
    };

    this.httpService.postData(baseUrl.bookings, dataToSend).subscribe(
      (data: any) => {
        this.loading = false;
        if (data?.data?.url && this.data?.is_instant_bookable !== 0) {
          this.configurePaymentOption(data?.data);
        } else {
          this.snackBar.open('Request sent successfully', 'x', {
            duration: 3000,
            panelClass: 'success',
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          this.viewRequestToBook();
        }
      },
      (err) => {
        this.loading = false;
        this.snackBar.open(
          err?.error?.message ||
            err?.error?.msg ||
            err?.error?.detail ||
            err?.error?.status ||
            'An error occured!',
          'x',
          {
            duration: 5000,
            panelClass: 'error',
            horizontalPosition: 'center',
            verticalPosition: 'top',
          }
        );
      }
    );
  }

  viewRequestToBook() {
    const data2: any = {
      data: {
        check_in: this.datepipe.transform(this.checkinDate, 'YYYY-MM-dd'),
        check_out: this.datepipe.transform(this.checkoutDate, 'YYYY-MM-dd'),
        price_per_night: this.data?.price_per_night,
        total_guests: this.getTotalGuest(),
        total: this.getTotalAmount(),
        pictures:
          this.data?.pictures?.length > 0
            ? this.data?.pictures[0]?.url
            : baseUrl.defaultImage,
        title: this.data?.title,
        description: this.data?.description,
      },
    };

    this.router.navigate(['/booking-preview', btoa(JSON.stringify(data2))]);
  }

  ngOnInit(): void {
    this.disabledDates = this.data.blocked_dates.map((x: any) => new Date(x));
  }

  ngOnDestroy(): void {
    this.clickEventSubscription?.unsubscribe();
  }
}
