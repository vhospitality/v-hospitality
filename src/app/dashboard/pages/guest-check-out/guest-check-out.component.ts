import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { baseUrl } from '../../../../environments/environment';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-guest-check-out',
  standalone: true,
  imports: [
    CommonModule,
    LazyLoadImageModule,
    RouterModule,
    HeaderComponent,
    FooterComponent,
    MatButtonModule,
  ],
  templateUrl: './guest-check-out.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./guest-check-out.component.scss'],
})
export class GuestCheckOutComponent {
  dafaultImage: string = baseUrl.defaultImage;
  data: any;

  constructor(private direct: ActivatedRoute, private router: Router) {
    this.direct.paramMap.subscribe((params) => {
      let id: any = params.get('id');
      let data = JSON.parse(atob(id));
      this.data = data?.data;
    });
  }

  feeback() {
    const data = {
      host_first_name: this.data?.host_first_name,
      host_last_name: this.data?.host_last_name,
      listing_uuid: this.data?.listing_uuid,
      booking_uuid: this.data?.booking_uuid,
    };
    this.router.navigate(['/review', btoa(JSON.stringify(data))]);
  }
}
