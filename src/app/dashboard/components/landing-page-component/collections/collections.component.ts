import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { CarouselModule } from 'primeng/carousel';
import { GalleriaModule } from 'primeng/galleria';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { baseUrl } from '../../../../../environments/environment';
import { HttpService } from '../../../../global-services/http.service';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';
import { NoDataMessageComponent } from '../../no-data-message/no-data-message.component';

@Component({
  selector: 'app-collections',
  standalone: true,
  imports: [
    CommonModule,
    CarouselModule,
    GalleriaModule,
    TooltipModule,
    MatButtonModule,
    RouterModule,
    SkeletonModule,
    LazyLoadImageModule,
    NoDataMessageComponent,
    SkeletonModule,
  ],
  templateUrl: './collections.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./collections.component.scss'],
})
export class CollectionsComponent implements OnInit {
  @Input() title: any;
  responsiveOptions: any[] = [];
  _activeIndex: number = 0;
  datas2: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  datas: any[] = [];
  dafaultImage: string = baseUrl.defaultImage;
  errorMessage: string = 'No collections found at the moment.';
  perPage = 20;

  constructor(
    private httpService: HttpService,
    private router: Router,
    private service: ToggleNavService
  ) {
    let data: any = this.service.getCollectionMessage();

    if (data) {
      this.datas = data;
      this.datas2 = [];
    } else {
      this.getCollections();
    }
  }

  getCollections() {
    this.datas2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    this.httpService.getSingleNoAuth(baseUrl.collection).subscribe(
      (data: any) => {
        this.datas2 = [];
        this.datas = data?.data;
        this.service.setCollectionMessage(data?.data);
      },
      () => {
        this.datas2 = [];
      }
    );
  }

  get activeIndex(): number {
    return this._activeIndex;
  }

  set activeIndex(newValue) {
    if (this.datas && 0 <= newValue && newValue <= this.datas.length - 1) {
      this._activeIndex = newValue;
    }
  }

  ngOnInit() {
    this.responsiveOptions = [
      {
        breakpoint: '1400px',
        numVisible: 3,
        numScroll: 1,
      },
      {
        breakpoint: '990px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '600px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }

  next() {
    this.activeIndex++;
  }

  prev() {
    this.activeIndex--;
  }

  redirect(type: string, collection?: any) {
    this.service.setAccommodationMessage({
      type: type,
      collection: collection,
    });
    this.router.navigate(['/accommodations']);
  }
}
