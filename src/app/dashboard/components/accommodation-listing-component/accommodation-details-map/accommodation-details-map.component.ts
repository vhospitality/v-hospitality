import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MapComponent } from '../../map/map.component';

@Component({
  selector: 'app-accommodation-details-map',
  standalone: true,
  imports: [CommonModule, MapComponent],
  templateUrl: './accommodation-details-map.component.html',
  styleUrls: ['./accommodation-details-map.component.scss'],
})
export class AccommodationDetailsMapComponent {
  @Input() data: any;
}
