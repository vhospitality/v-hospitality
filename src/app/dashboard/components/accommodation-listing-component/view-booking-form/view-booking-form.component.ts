import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CalendarModule } from 'primeng/calendar';
import { SelectOptionComponent } from '../../select/select-option/select-option.component';
import { SelectComponent } from '../../select/select.component';

@Component({
  selector: 'app-view-booking-form',
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
  templateUrl: './view-booking-form.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./view-booking-form.component.scss'],
})
export class ViewBookingFormComponent implements OnInit {
  @Input() data: any;
  checkinDate: any;
  checkoutDate: any;

  selectOption: any[] = [
    {
      id: 1,
      gender: 'Adults',
      desc: 'Ages 13 or above',
      total: 0,
    },
    {
      id: 2,
      gender: 'Children',
      desc: 'Ages 2 - 12',
      total: 0,
    },
    {
      id: 3,
      gender: 'Infants',
      desc: 'Under 2',
      total: 0,
    },
  ];

  getNumberOfNight() {
    const date1: any = new Date(this.data?.check_in);
    const date2: any = new Date(this.data?.check_out);
    date1.setHours(0, 0, 0, 0);
    date2.setHours(0, 0, 0, 0);

    const diffTime1 = Math.abs(date2 - date1);
    const diffDays1 = Math.floor(diffTime1 / (1000 * 60 * 60 * 24));
    return diffDays1 < 1 ? 1 : diffDays1;
  }

  getTotalGuest() {
    return (
      this.selectOption?.find((n: any) => n?.id === 1)?.total +
      this.selectOption?.find((n: any) => n?.id === 2)?.total +
      this.selectOption?.find((n: any) => n?.id === 3)?.total
    );
  }

  getServiceChargeAmount(data: any) {
    const tax = 6 / 100;
    const serviceCharge = data?.price_per_night * this.getNumberOfNight();
    return serviceCharge * tax;
  }

  getTaxAmount(data: any) {
    const tax = data?.occupancy_taxes / 100;
    const nightPrice = data?.price_per_night * this.getNumberOfNight();
    const amount = nightPrice + this.getServiceChargeAmount(data);
    return amount * tax;
  }

  getTotalAmount(data: any) {
    const tax = this.getTaxAmount(data);
    const service_fee = this.getServiceChargeAmount(data);
    const nightPrice = data?.price_per_night * this.getNumberOfNight();
    const total = nightPrice + service_fee + tax;
    return total;
  }

  ngOnInit(): void {
    let selectOption = [
      {
        id: 1,
        gender: 'Adults',
        desc: 'Ages 13 or above',
        total: this.data?.guests?.adults || 0,
      },
      {
        id: 2,
        gender: 'Children',
        desc: 'Ages 2 - 12',
        total: this.data?.guests?.children || 0,
      },
      {
        id: 3,
        gender: 'Infants',
        desc: 'Under 2',
        total: this.data?.guests?.infants || 0,
      },
    ];
    this.selectOption = selectOption;

    this.checkinDate = new Date(this.data?.check_in);
    this.checkoutDate = new Date(this.data?.check_out);
  }
}
