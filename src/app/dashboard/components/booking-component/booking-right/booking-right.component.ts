import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { baseUrl } from '../../../../../environments/environment';

@Component({
  selector: 'app-booking-right',
  standalone: true,
  imports: [CommonModule, RouterModule, LazyLoadImageModule],
  templateUrl: './booking-right.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./booking-right.component.scss'],
})
export class BookingRightComponent {
  @Input() data: any;
  dafaultImage: string = baseUrl.defaultImage;
}
