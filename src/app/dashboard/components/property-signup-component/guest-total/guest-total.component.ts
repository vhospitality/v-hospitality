import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { baseUrl } from '../../../../../environments/environment';
import { AuthService } from '../../../../global-services/auth.service';
import { HttpService } from '../../../../global-services/http.service';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';

@Component({
  selector: 'app-guest-total',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './guest-total.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./guest-total.component.scss'],
})
export class GuestTotalComponent {
  @Input() componentData: any;
  selectOption: any[] = [
    {
      id: 1,
      name: 'Maximum Guests',
      total: 0,
    },
    {
      id: 2,
      name: 'Bedrooms',
      total: 0,
    },
    {
      id: 3,
      name: 'Beds',
      total: 0,
    },
  ];
  error: string = '';
  id: number = 0;
  loading: boolean = false;

  clickEventSubscription?: Subscription;

  constructor(
    private service: ToggleNavService,
    private httpService: HttpService,
    private authService: AuthService
  ) {
    this.authService.checkExpired();

    this.clickEventSubscription = this.service
      .getPropertyClickEvent()
      .subscribe((data: any) => {
        this.add(data);
      });

    let data: any = this.service.getPropertyMessage();
    this.id = data?.id;

    if (data?.totalGuest) {
      this.selectOption = data?.totalGuest;
    }
  }

  addOrMinus(type: string, id: number) {
    let findId = this.selectOption.findIndex((x) => x?.id === id);

    if (type === 'add') {
      this.selectOption[findId].total += 1;
    } else if (type === 'minus') {
      if (this.selectOption[findId].total < 1) {
        this.selectOption[findId].total = 0;
      } else {
        this.selectOption[findId].total -= 1;
      }
    }
  }

  add(type: any) {
    if (type?.componentNumber == 3) {
      if (this.selectOption.find((x) => x?.id == 1 && x?.total == 0)) {
        this.error = 'Please add number of guests';
        this.service.sendSubmitPropertyClickEvent({
          type: 'error',
        });
      } else if (this.selectOption.find((x) => x?.id == 2 && x?.total == 0)) {
        this.service.sendSubmitPropertyClickEvent({
          type: 'error',
        });
        this.error = 'Please add number of bedrooms';
      } else if (this.selectOption.find((x) => x?.id == 3 && x?.total == 0)) {
        this.error = 'Please add number of beds';
        this.service.sendSubmitPropertyClickEvent({
          type: 'error',
        });
      } else {
        this.updateData(type);
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
          no_of_guests: this.selectOption?.find((x: any) => x?.id == 1)?.total,
          no_of_bedrooms: this.selectOption?.find((x: any) => x?.id == 2)
            ?.total,
          no_of_beds: this.selectOption?.find((x: any) => x?.id == 3)?.total,
          step: 3,
        }
      )
      .subscribe(
        () => {
          this.loading = false;
          let data: any = this.service.getPropertyMessage();

          Object.assign(data, {
            totalGuest: this.selectOption,
          });

          this.service.setPropertyMessage(data);
          this.service.sendSubmitPropertyClickEvent({
            type: type?.type,
            componentNumber: 3,
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
