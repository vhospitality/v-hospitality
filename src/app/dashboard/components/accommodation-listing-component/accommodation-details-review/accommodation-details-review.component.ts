import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { Subscription } from 'rxjs';
import { baseUrl } from '../../../../../environments/environment';
import { HttpService } from '../../../../global-services/http.service';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';
import { DialogComponent } from '../../dialog/dialog.component';
import { NoDataMessageComponent } from '../../no-data-message/no-data-message.component';

@Component({
  selector: 'app-accommodation-details-review',
  standalone: true,
  imports: [CommonModule, RouterModule, SkeletonModule, NoDataMessageComponent],
  templateUrl: './accommodation-details-review.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./accommodation-details-review.component.scss'],
})
export class AccommodationDetailsReviewComponent implements OnInit {
  @Input() data: any;
  reviews: any[] = [];
  loading: boolean = false;
  errorMessage = '';
  userData: any = this.service.getProfileMessage();
  defaultPicture = baseUrl?.defaultImage;
  clickEventSubscription?: Subscription;

  constructor(
    private dialog: MatDialog,
    private httpService: HttpService,
    private service: ToggleNavService
  ) {
    this.clickEventSubscription = this.service
      .getIsLoginClickEvent()
      .subscribe(() => {
        this.userData = this.service.getProfileMessage();
      });
  }

  getReviews() {
    this.loading = true;
    this.httpService
      .getSingleNoAuth(
        baseUrl.listing +
          `/${
            this.data?.listing?.uuid || this.data?.uuid
          }/reviews?include=listing,user&fields[reviews]=uuid,user_id,listing_id,host_id,expectations,cleanliness,communication,observance_of_house_rules,public_rating,public_description,host_reply,created_at,updated_at&fields[listing]=uuid&fields[user]=first_name,last_name,pictures&paginate=true`
      )
      .subscribe(
        (data: any) => {
          this.loading = false;
          this.reviews = data?.data?.data;
        },
        () => {
          this.loading = false;
        }
      );
  }

  openDialog(data: any, type: string) {
    this.dialog.closeAll();
    this.dialog.open(DialogComponent, {
      data: {
        type: type,
        data: data,
      },
    });
  }

  ngOnInit(): void {
    this.errorMessage = `No reviews found for ${
      this.data?.title || this.data?.listing?.title
    }`;
    this.getReviews();
  }
}
