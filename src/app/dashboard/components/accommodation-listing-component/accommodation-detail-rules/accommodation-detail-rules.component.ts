import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-accommodation-detail-rules',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accommodation-detail-rules.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./accommodation-detail-rules.component.scss'],
})
export class AccommodationDetailRulesComponent {
  @Input() data: any;
}
