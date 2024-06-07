import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-accommodation-detail-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accommodation-detail-detail.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./accommodation-detail-detail.component.scss'],
})
export class AccommodationDetailDetailComponent {
  @Input() data: any;
}
