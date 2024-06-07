import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { baseUrl } from '../../../../environments/environment';
import { BackButtonComponent } from '../../components/back-button/back-button.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { EscapeHtmlPipe } from '../../pipes/escape-html.pipe';

@Component({
  selector: 'app-booking-pending',
  standalone: true,
  imports: [
    CommonModule,
    LazyLoadImageModule,
    RouterModule,
    HeaderComponent,
    FooterComponent,
    EscapeHtmlPipe,
    MatButtonModule,
    BackButtonComponent,
  ],
  templateUrl: './booking-pending.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./booking-pending.component.scss'],
})
export class BookingPendingComponent {
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
