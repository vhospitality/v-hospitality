import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';

@Component({
  selector: 'app-listing-details',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './listing-details.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./listing-details.component.scss'],
})
export class ListingDetailsComponent {
  @Input() listingDetails: any;

  constructor(private service: ToggleNavService, private router: Router) {}

  getTotalGuest(guests: any) {
    return guests?.find((n: any) => n?.id === 1)?.total;
  }

  getTotalBedroom(guests: any) {
    return guests?.find((n: any) => n?.id === 2)?.total;
  }

  getTotalBed(guests: any) {
    return guests?.find((n: any) => n?.id === 3)?.total;
  }

  getTotalPrivate(guests: any) {
    return guests?.find((n: any) => n?.id === 1)?.total;
  }

  getTotalDedicated(guests: any) {
    return guests?.find((n: any) => n?.id === 2)?.total;
  }

  getTotalShared(guests: any) {
    return guests?.find((n: any) => n?.id === 3)?.total;
  }

  edit(step: number) {
    let accommodationDetails: any = this.service.getAccommodationMessage();

    Object.assign(accommodationDetails, {
      step: step,
    });

    this.service.setAccommodationMessage(accommodationDetails);
    this.service.setPropertyMessage(accommodationDetails);
    this.router.navigate(['/property-signup']);
  }
}
