import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';

@Component({
  selector: 'app-booking-left',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-left.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./booking-left.component.scss'],
})
export class BookingLeftComponent implements OnDestroy {
  @Input() data: any;

  constructor(private service: ToggleNavService) {}

  ngOnDestroy(): void {
    this.service.setAccommodationMessage(undefined);
    this.service.setPropertyMessage(undefined);
  }
}
