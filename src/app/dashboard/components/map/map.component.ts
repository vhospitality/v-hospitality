import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { Observable } from 'rxjs';
import { HttpService } from '../../../global-services/http.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule],
  templateUrl: './map.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  @Input() data: any;
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap | undefined;
  apiLoaded: Observable<boolean>;

  myLatLng = { lat: 9.082, lng: 8.6753 }; // Map Options
  mapOptions: google.maps.MapOptions = {
    center: this.myLatLng,
    zoom: 5,
  };

  markerOptions: google.maps.MarkerOptions = {
    icon: '/assets/icons/mapmarker.png',
  };

  spots: any = [];

  constructor(private httpService: HttpService) {
    this.apiLoaded = this.httpService.getMapData();
  }

  shareLocation(coordinate: any) {
    (window as any).open(
      `https://www.google.com/maps/@${coordinate?.lat},${coordinate?.lng},10z?entry=ttu`,
      '_blank'
    );
  }

  updataMap() {
    if (this.data?.geo) {
      this.data?.geo?.filter((name: any) => {
        this.spots.push({
          lat: parseFloat(name?.latitude),
          lng: parseFloat(name?.longitude),
          address: name?.street_address,
        });
      });
    }
  }

  ngOnInit(): void {
    this.updataMap();
  }
}
