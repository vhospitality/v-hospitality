import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { baseUrl } from '../../../../environments/environment';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { EscapeHtmlPipe } from '../../pipes/escape-html.pipe';

@Component({
  selector: 'app-listing-review',
  standalone: true,
  imports: [
    CommonModule,
    LazyLoadImageModule,
    RouterModule,
    HeaderComponent,
    FooterComponent,
    EscapeHtmlPipe,
    MatButtonModule,
  ],
  templateUrl: './listing-review.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./listing-review.component.scss'],
})
export class ListingReviewComponent {
  dafaultImage: string = baseUrl.defaultImage;
  data: any;

  constructor(private direct: ActivatedRoute) {
    this.direct.paramMap.subscribe((params) => {
      let id: any = params.get('id');
      let data = JSON.parse(atob(id));
      this.data = data?.data;
    });
  }
}
