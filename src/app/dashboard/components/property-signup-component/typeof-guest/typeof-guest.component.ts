import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { baseUrl } from '../../../../../environments/environment';
import { HttpService } from '../../../../global-services/http.service';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';

@Component({
  selector: 'app-typeof-guest',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './typeof-guest.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./typeof-guest.component.scss'],
})
export class TypeofGuestComponent {
  @Input() componentData: any;
  tagActive?: string;
  id: number = 0;
  cards: any[] = [
    {
      title: 'An entire place',
      subTitle: 'Guests have the whole place to themselves.',
      img: 'property-home-icon.svg',
      tag: 'entire_place',
    },
    {
      title: 'A room',
      subTitle:
        'Guests have their own room in a home, plus access to shared spaces.',
      img: 'property-home2-icon.svg',
      tag: 'a_room',
    },
    {
      title: 'A shared room',
      subTitle:
        'Guests sleep in a room or common area that may be shared with you or others',
      img: 'property-home3-icon.svg',
      tag: 'shared_room',
    },
  ];
  error: string = '';
  loading: boolean = false;

  clickEventSubscription?: Subscription;

  constructor(
    private service: ToggleNavService,
    private httpService: HttpService
  ) {
    this.clickEventSubscription = this.service
      .getPropertyClickEvent()
      .subscribe((data: any) => {
        this.add(data);
      });

    let data: any = this.service.getPropertyMessage();
    this.id = data?.id;

    if (data?.placeType) {
      this.tagActive = data?.placeType;
    }
  }

  add(type: any) {
    if (type?.componentNumber == 2) {
      if (this.tagActive) {
        this.updateData(type);
      } else {
        this.error = 'Please select one!';
        this.service.sendSubmitPropertyClickEvent({
          type: 'error',
        });
      }
    }
  }

  updateData(type: any) {
    this.loading = true;

    let data: any = this.service.getPropertyMessage();

    this.httpService
      .updateData(
        data?.id
          ? baseUrl.draft + '/' + data?.id
          : baseUrl.listing + '/' + data?.uuid,
        {
          type: this.tagActive,
          step: 2,
        }
      )
      .subscribe(
        () => {
          this.loading = false;
          let data: any = this.service.getPropertyMessage();
          Object.assign(data, {
            placeType: this.tagActive,
          });

          this.service.setPropertyMessage(data);
          this.service.sendSubmitPropertyClickEvent({
            type: type?.type,
            componentNumber: 2,
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
