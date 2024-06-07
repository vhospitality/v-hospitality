import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SkeletonModule } from 'primeng/skeleton';
import { Subscription } from 'rxjs';
import { baseUrl } from '../../../../../environments/environment';
import { AuthService } from '../../../../global-services/auth.service';
import { HttpService } from '../../../../global-services/http.service';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';

@Component({
  selector: 'app-amenities',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    FormsModule,
    SkeletonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './amenities.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./amenities.component.scss'],
})
export class AmenitiesComponent {
  @Input() componentData: any;
  data: any[] = [];
  error: string = '';
  id: number = 0;
  loading: boolean = false;
  @ViewChild('fform') feedbackFormDirective: any;
  feedbackForm: any = FormGroup;
  selectedUUID: any[] = [];

  clickEventSubscription?: Subscription;

  constructor(
    private service: ToggleNavService,
    private httpService: HttpService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.authService.checkExpired();

    this.clickEventSubscription = this.service
      .getPropertyClickEvent()
      .subscribe((data: any) => {
        this.add(data);
      });

    let data: any = this.service.getPropertyMessage();
    let amenities: any = this.service.getAmenitiesMessage();
    this.id = data?.id;

    if (this.data.length == 0 && amenities) {
      for (let n of amenities) {
        if (n?.amenities?.length > 0) {
          this.data.push(n);
        }
      }

      if (data?.amenities?.length > 0) {
        for (let n of data?.amenities) {
          this.selectedUUID.push(n?.uuid);
        }
      }
    } else if (this.data.length == 0 && !amenities) {
      this.getAmenities();
    }
  }

  selectAmenity(id: number) {
    let getCategory = this.data.find((n: any) => n?.id == id);
  }

  getAmenities() {
    this.httpService
      .getSingleNoAuth(
        baseUrl.amenityCategories + '?include=amenities&per_page=100'
      )
      .subscribe(
        (data: any) => {
          for (let n of data?.data) {
            if (n?.amenities?.length > 0) {
              this.data.push(n);
            }
          }

          let data2: any = this.service.getPropertyMessage();
          if (data2?.amenities?.length > 0) {
            for (let n of data2?.amenities) {
              this.selectedUUID.push(n?.uuid);
            }
          }

          this.service.setAmenitiestMessage(data?.data);
        },
        (err) => {}
      );
  }

  changeActive(uuid: string) {
    let index = this.selectedUUID.indexOf(uuid);

    if (index !== -1) {
      this.selectedUUID.splice(index, 1);
    } else {
      this.selectedUUID.push(uuid);
    }
  }

  add(type: any) {
    if (type?.componentNumber == 10) {
      this.updateData(type);
    }
  }

  async updateData(type: any) {
    this.loading = true;

    let data: any = this.service.getPropertyMessage();

    let amenities3: any = [];
    let getAllAmenities: any = [];

    for await (let n of this.data) {
      if (n?.amenities?.length > 0) {
        for await (let a of n?.amenities) {
          getAllAmenities.push(a);
        }
      }
    }

    for await (let n of this.selectedUUID) {
      let find = getAllAmenities.find((a: any) => a?.uuid == n);
      if (find) {
        amenities3.push({ name: find?.name, value: true, uuid: find?.uuid });
      }
    }

    this.httpService
      .updateData(
        data?.id
          ? baseUrl.draft + '/' + data?.id
          : baseUrl.listing + '/' + data?.uuid,
        {
          amenities: this.selectedUUID,
          step: 10,
        }
      )
      .subscribe(
        (data2: any) => {
          this.loading = false;
          let data: any = this.service.getPropertyMessage();

          Object.assign(data, {
            amenities: amenities3,
          });

          this.service.setPropertyMessage(data);
          this.service.sendSubmitPropertyClickEvent({
            type: type?.type,
            componentNumber: 10,
          });
        },
        (err) => {
          this.loading = false;
          this.error =
            err?.error?.message ||
            err?.error?.msg ||
            err?.error?.detail ||
            'An error occured, please try again';

          this.service.sendSubmitPropertyClickEvent({
            type: 'error',
          });
        }
      );
  }
}
