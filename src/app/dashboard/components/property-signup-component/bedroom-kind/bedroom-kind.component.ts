import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Subscription } from 'rxjs';
import { baseUrl } from '../../../../../environments/environment';
import { AuthService } from '../../../../global-services/auth.service';
import { HttpService } from '../../../../global-services/http.service';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';

@Component({
  selector: 'app-bedroom-kind',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './bedroom-kind.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./bedroom-kind.component.scss'],
})
export class BedroomKindComponent {
  @Input() componentData: any;
  selectOption: any[] = [
    {
      id: 1,
      name: 'Private and attached',
      sub_title: "It's connected to the guest's room and is just for them.",
      total: 0,
    },
    {
      id: 2,
      name: 'Dedicated',
      sub_title:
        "It's private, but accessed via a shared space, like a hallway.",
      total: 0,
    },
    {
      id: 3,
      name: 'Shared',
      sub_title: "It's shared with other people.",
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

    if (data?.bedroomKind) {
      this.selectOption = data?.bedroomKind;
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
    if (type?.componentNumber == 4) {
      this.updateData(type);
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
          no_of_private_bathroom: this.selectOption?.find(
            (x: any) => x?.id == 1
          )?.total,

          no_of_dedicated_bathroom: this.selectOption?.find(
            (x: any) => x?.id == 2
          )?.total,

          no_of_shared_bathroom: this.selectOption?.find((x: any) => x?.id == 3)
            ?.total,
          step: 4,
        }
      )
      .subscribe(
        () => {
          this.loading = false;
          let data: any = this.service.getPropertyMessage();
          Object.assign(data, {
            bedroomKind: this.selectOption,
          });

          this.service.setPropertyMessage(data);
          this.service.sendSubmitPropertyClickEvent({
            type: type?.type,
            componentNumber: 4,
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
