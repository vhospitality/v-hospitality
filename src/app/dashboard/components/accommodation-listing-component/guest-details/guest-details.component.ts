import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { Subscription } from 'rxjs';
import { baseUrl } from '../../../../../environments/environment';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-guest-details',
  standalone: true,
  imports: [CommonModule, LazyLoadImageModule, MatMenuModule, MatButtonModule],
  templateUrl: './guest-details.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./guest-details.component.scss'],
})
export class GuestDetailsComponent {
  @Input() data: any;
  userData: any = this.service.getProfileMessage();
  defaultImage: string = baseUrl.defaultImage;
  clickEventSubscription?: Subscription;

  constructor(private service: ToggleNavService, private dialog: MatDialog) {
    this.clickEventSubscription = this.service
      .getIsLoginClickEvent()
      .subscribe(() => {
        this.userData = this.service.getProfileMessage();
      });
  }

  displayDecline(data: any) {
    const date1: any = new Date(data?.check_in);
    const date2: any = new Date();
    // Calculate the difference in milliseconds
    const differenceInMilliseconds = Math.abs(date2 - date1);
    // Convert milliseconds to hours
    const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);
    if (Number(differenceInHours) >= 24) {
      return true;
    } else {
      return false;
    }
  }

  openDialog(data: any) {
    this.dialog.closeAll();
    this.dialog.open(DialogComponent, {
      data: {
        type: 'dialog',
        data: data,
      },
    });
  }
}
