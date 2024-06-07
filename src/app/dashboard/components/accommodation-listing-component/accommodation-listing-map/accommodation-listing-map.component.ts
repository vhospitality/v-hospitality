import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accommodation-listing-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accommodation-listing-map.component.html',
  styleUrls: ['./accommodation-listing-map.component.scss']
})
export class AccommodationListingMapComponent {
  @Input() data: any;
}
