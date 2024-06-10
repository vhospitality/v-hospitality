import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { BookingLeftComponent } from '../../components/booking-component/booking-left/booking-left.component';
import { BookingRightComponent } from '../../components/booking-component/booking-right/booking-right.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { ToggleNavService } from '../../dashboard-service/toggle-nav.service';
import { BackButtonComponent } from '../../components/back-button/back-button.component';

@Component({
  selector: 'app-accommodation-booking',
  standalone: true,
  imports: [
    CommonModule,
    BookingLeftComponent,
    BookingRightComponent,
    HeaderComponent,
    FooterComponent,
    MatButtonModule,
    RouterModule,
    BackButtonComponent,
  ],
  templateUrl: './accommodation-booking.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./accommodation-booking.component.scss'],
})
export class AccommodationBookingComponent implements OnInit {
  @Input() data: any;

  constructor(private service: ToggleNavService) {}

  ngOnInit(): void {
    this.data = this.service.getAccommodationMessage();
  }
}
