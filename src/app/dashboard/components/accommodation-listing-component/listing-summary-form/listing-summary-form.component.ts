import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-listing-summary-form',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './listing-summary-form.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./listing-summary-form.component.scss'],
})
export class ListingSummaryFormComponent {
  @Input() data: any;
  checkinDate: any;
  checkoutDate: any;

  getNumberOfNight() {
    const date1: any = new Date(this.checkinDate);
    const date2: any = new Date(this.checkoutDate);

    date1.setHours(0, 0, 0, 0);
    date2.setHours(0, 0, 0, 0);

    const diffTime1 = Math.abs(date2 - date1);
    const diffDays1 = Math.floor(diffTime1 / (1000 * 60 * 60 * 24));
    return diffDays1 < 1 ? 1 : diffDays1;
  }
}
