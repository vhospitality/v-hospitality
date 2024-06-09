import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { PaginatorModule } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { baseUrl } from '../../../../environments/environment';
import { AuthService } from '../../../global-services/auth.service';
import { HttpService } from '../../../global-services/http.service';
import { BackButtonComponent } from '../../components/back-button/back-button.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { NoDataMessageComponent } from '../../components/no-data-message/no-data-message.component';
import { ToggleNavService } from '../../dashboard-service/toggle-nav.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [
    CommonModule,
    PaginatorModule,
    HeaderComponent,
    FooterComponent,
    LazyLoadImageModule,
    SkeletonModule,
    NoDataMessageComponent,
    RouterModule,
    BackButtonComponent,
  ],
  templateUrl: './wishlist.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent implements AfterViewInit {
  total = 12;
  total_records = 0;
  datas2: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  datas: any[] = [];
  perPage = 15;
  dafaultImage: string = baseUrl.defaultImage;
  errorMessage: string = "You don't have any active wishlist at the moment";
  wishlistLoading?: string;
  previousPage?: number;

  constructor(
    private httpService: HttpService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private service: ToggleNavService
  ) {}

  paginateData(event?: any) {
    this.datas2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    this.datas = [];

    const get_current_page =
      event?.first + this.perPage || this.previousPage || this.perPage;
    this.previousPage = get_current_page;

    this.httpService
      .getAuthSingle(
        baseUrl.wishlist +
          `/?per_page=${this.perPage}&page=${
            get_current_page / this.perPage
          }&paginate=true&include=listing&fields[listing]=uuid,title,reviews_count,reviews_score,type,amenities,pictures,street_address,description,apt_suite,price_per_night`
      )
      .subscribe(
        (data: any) => {
          this.datas = data?.data?.data;
          this.total_records = data?.data?.total;
          this.datas2 = [];
        },
        () => {
          this.datas = [];
          this.datas2 = [];
          this.total_records = 0;
        }
      );
  }

  deleteWishlist(data: any) {
    if (!this.wishlistLoading) {
      this.wishlistLoading = data?.uuid;

      this.httpService.deleteData(baseUrl.wishlist, `/${data?.uuid}`).subscribe(
        () => {
          this.wishlistLoading = undefined;

          let wishlist: any = this.service.getWishlistMessage();
          if (wishlist) {
            let index = wishlist.findIndex((n: any) => n?.uuid === data?.uuid);
            if (index !== -1) {
              wishlist.splice(index, 1);
              this.service.setWishlistMessage(wishlist);
            }
          }

          this.paginateData(this.previousPage);
          this.service.sendIsLoginClickEvent();

          this.snackBar.open('Successfully deleted wishlist item', 'x', {
            duration: 3000,
            panelClass: 'success',
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        },
        () => {
          this.authService.checkExpired();
          this.wishlistLoading = undefined;

          this.snackBar.open('Failed to delete wishlist item', 'x', {
            duration: 3000,
            panelClass: 'error',
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        }
      );
    }
  }

  ngAfterViewInit(): void {
    this.authService.checkExpired();
    this.paginateData();
  }
}
