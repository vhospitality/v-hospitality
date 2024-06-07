import { CommonModule, Location } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { baseUrl } from '../../../../environments/environment';
import { HttpService } from '../../../global-services/http.service';
import { BookingRightComponent } from '../../components/booking-component/booking-right/booking-right.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { ListingDetailsComponent } from '../../components/host-listing-component/listing-details/listing-details.component';
import { ToggleNavService } from '../../dashboard-service/toggle-nav.service';

@Component({
  selector: 'app-listing-summary',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    MatButtonModule,
    ListingDetailsComponent,
    BookingRightComponent,
    RouterModule,
  ],
  templateUrl: './listing-summary.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./listing-summary.component.scss'],
})
export class ListingSummaryComponent {
  data: any;
  loading: boolean = false;

  constructor(
    private service: ToggleNavService,
    private router: Router,
    private _location: Location,
    private httpService: HttpService,
    private snackBar: MatSnackBar
  ) {
    let data: any = this.service.getAccommodationMessage();
    this.data = data;

    if (!data) {
      this._location.back();
    }
  }

  submitForApproval() {
    this.loading = true;
    this.httpService
      .postData(
        baseUrl.draft + `/${this.data?.id || this.data?.uuid}/approvals`,
        ''
      )
      .subscribe(
        () => {
          this.loading = false;
          this.router.navigate(['/property-pending-approval']);
        },
        (err) => {
          this.loading = false;
          this.snackBar.open(
            err?.error?.message ||
              err?.error?.msg ||
              err?.error?.detail ||
              err?.error?.status ||
              'An error occured!',
            'x',
            {
              duration: 5000,
              panelClass: 'error',
              horizontalPosition: 'center',
              verticalPosition: 'top',
            }
          );
        }
      );
  }
}
