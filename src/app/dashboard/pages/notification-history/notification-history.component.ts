import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { baseUrl } from '../../../../environments/environment';
import { AuthService } from '../../../global-services/auth.service';
import { HttpService } from '../../../global-services/http.service';
import { BackButtonComponent } from '../../components/back-button/back-button.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { ToggleNavService } from '../../dashboard-service/toggle-nav.service';
import { DateAgoPipe } from '../../pipes/date-ago.pipe';

@Component({
  selector: 'app-notification-history',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    InfiniteScrollModule,
    LazyLoadImageModule,
    DateAgoPipe,
    BackButtonComponent,
  ],
  templateUrl: './notification-history.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./notification-history.component.scss'],
})
export class NotificationHistoryComponent implements AfterViewInit {
  notifications: any[] = [];
  totalNotification: number = 0;
  isLoading: boolean = false;
  currentPage: number = 1;
  itemsPerPage: number = 15;
  isReadNotificationLoading: boolean = false;
  defaultImage: string = baseUrl?.defaultProfileImage;
  defaultImage2: string = baseUrl?.defaultImage;

  constructor(
    private authService: AuthService,
    private httpService: HttpService,
    private service: ToggleNavService
  ) {
    this.getNotification();
  }

  getNotification() {
    this.isLoading = true;
    this.currentPage = 0;
    this.notifications = [];

    this.httpService
      .getAuthSingle(
        baseUrl.notifications +
          `/?filter[notification]=all&per_page=${this.itemsPerPage}&page=${this.currentPage}`
      )
      .subscribe(
        (data: any) => {
          this.notifications = data?.data?.data;
          this.totalNotification = data?.data?.total || 0;
          this.service.setNotificationMessage(data?.data?.data);
          this.readNotification();
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  // read notification
  readNotification() {
    this.isReadNotificationLoading = true;

    this.httpService.updateData(baseUrl.notifications + '/all', '').subscribe(
      (data: any) => {
        this.isReadNotificationLoading = false;
        this.notifications.forEach((_: any, index: number) => {
          this.notifications[index]['read_at'] = new Date();
        });
      },
      (err) => {
        this.isReadNotificationLoading = false;
      }
    );
  }

  // this method will be called on scrolling the page
  appendNotification = () => {
    this.isLoading = true;

    this.httpService
      .getAuthSingle(
        baseUrl.notifications +
          `/?filter[notification]=all&per_page=${this.itemsPerPage}&page=${this.currentPage}`
      )
      .subscribe(
        (data: any) => {
          this.notifications = [...this.notifications, ...data?.data?.data];

          // remove duplicate
          const uniqueYear = [
            ...new Map(this.notifications.map((v: any) => [v?.id, v])).values(),
          ];
          this.notifications = uniqueYear.map((item) => item);
          this.service.setNotificationMessage(this.notifications);
          this.isLoading = false;
        },
        (err) => {
          this.isLoading = false;
        }
      );
  };

  onScroll = () => {
    this.currentPage++;
    this.appendNotification();
  };

  ngAfterViewInit(): void {
    this.authService.checkExpired();
  }
}
