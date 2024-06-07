import { CommonModule } from '@angular/common';
import { Component, Input, NgZone, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { baseUrl } from '../../../../../environments/environment';
import { AuthService } from '../../../../global-services/auth.service';
import { ChatService } from '../../../../global-services/chat.service';
import { HttpService } from '../../../../global-services/http.service';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';
import { DialogComponent } from '../../dialog/dialog.component';

declare let window: any;

@Component({
  selector: 'app-select-card-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-card-dialog.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./select-card-dialog.component.scss'],
})
export class SelectCardDialogComponent {
  @Input() card: any;
  currentId = 1;
  serviceData: any = {};
  userData: any = this.service.getProfileMessage();

  questions: any[] = [
    { name: 'Pay with existing card', id: 1 },
    { name: 'Pay with new card', id: 2 },
  ];

  paymentDone(ref: any) {
    if (this.card?.type == 'booking') {
      this.serviceData = this.card?.serviceData;

      Object.assign(this.serviceData, {
        reference: ref?.reference,
        listing: this.card?.listing,
        total: this.card?.total,
        check_in: this.card?.metadata?.check_in,
        check_out: this.card?.metadata?.check_out,
        total_guests: this.card?.metadata?.no_of_guests,
      });

      this.service.setAccommodationMessage(undefined);
      this.service.setPropertyMessage(undefined);
      this.service.accommodationMessage = undefined;
      this.service.propertyMessage = undefined;
      this.service.setAccommodationMessage(this.serviceData);
      this.sendMessage();

      this.zone.run(() => {
        this.openDialog(
          {
            reference: ref?.reference,
            message:
              'You have just made a payment, would you like to save card for subsequent payments?',
            requestType: 'success-error',
            title: 'Save card details',
            requestMessage: '',
            type: 'card',
          },
          'dialog'
        );

        this.router.navigate(['/booking']);
      });
    } else {
      this.snackBar.open('Success', 'x', {
        duration: 3000,
        panelClass: 'success',
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });

      this.service.sendReloadSubscriptionClickEvent();
      this.closeDialog();
    }
  }

  constructor(
    private dialog: MatDialog,
    private zone: NgZone,
    private authService: AuthService,
    private service: ToggleNavService,
    private router: Router,
    private snackBar: MatSnackBar,
    private httpService: HttpService,
    private chatService: ChatService
  ) {
    this.authService.checkExpired();
  }

  openDialog(data: any, type: string) {
    this.dialog.closeAll();
    this.dialog.open(DialogComponent, {
      data: {
        type: type,
        data: data,
      },
    });
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  sendMessage() {
    // check if user exist for messaging
    this.userData = this.service.getProfileMessage();

    this.httpService
      .getForChat(baseUrl.messagingUrl + `user?u_id=${this.userData?.uuid}`)
      .subscribe(
        () => {
          if (this.card?.host?.uuid === this.userData?.uuid) {
            localStorage.setItem(
              baseUrl.localStorageSelectedChat,
              JSON.stringify({
                first_name: this.userData.first_name,
                last_name: this.userData.last_name,
                u_id: this.userData.uuid,
              })
            );

            this.joinRoom({
              users: [this.card?.host?.uuid, this.userData?.uuid],
              roomId: this.card?.host?.uuid + this.userData?.uuid,
            });
          } else {
            localStorage.setItem(
              baseUrl.localStorageSelectedChat,
              JSON.stringify({
                first_name: this.card?.host?.first_name,
                last_name: this.card?.host?.last_name,
                u_id: this.card?.host?.uuid,
              })
            );
            this.joinRoom({
              users: [this.card?.host?.uuid, this.userData?.uuid],
              roomId: this.card?.host?.uuid + this.userData?.uuid,
            });
          }
        },
        (err) => {
          if (err?.status == 404 || err?.status == 400) {
            this.registerForMessaging();
          }
        }
      );
  }

  joinRoom(roomDetails: any) {
    this.httpService
      .registerForChat(baseUrl.messagingUrl + 'rooms', roomDetails)
      .subscribe(
        (data: any) => {
          this.chatService.joinRoom(roomDetails);
          this.sendChatMessage(
            data?.roomId,
            `Hello ${this.userData?.first_name}! 🌟 We're delighted to have you as our guest! If there's anything you need during your stay, don't hesitate to reach out. Your comfort and satisfaction are our top priorities.`
          );

          let rooms = JSON.parse(localStorage.getItem(baseUrl.rooms) as any);
          if (rooms) {
            rooms.unshift(data);
            // remove duplicate
            const uniqueYear = [
              ...new Map(rooms.map((v: any) => [v?._id, v])).values(),
            ];
            rooms = uniqueYear.map((item) => item);
          }
          localStorage.setItem(baseUrl.rooms, JSON.stringify(rooms || [data]));
        },
        (err) => {}
      );
  }

  registerForMessaging() {
    const localToken = JSON.stringify(
      localStorage.getItem('V_HOSPITALITY_DEVICE_TOKEN') as any
    );

    this.httpService
      .registerForChat(baseUrl.messagingUrl + 'user', {
        first_name: this.userData?.first_name,
        last_name: this.userData?.last_name,
        u_id: this.userData?.uuid,
        device_token: this.userData?.device_token || JSON.parse(localToken),
      })
      .subscribe(
        (data) => {
          if (this.card?.host?.uuid === this.userData?.uuid) {
            localStorage.setItem(
              baseUrl.localStorageSelectedChat,
              JSON.stringify({
                first_name: this.userData?.first_name,
                last_name: this.userData?.last_name,
                u_id: this.userData?.uuid,
              })
            );

            this.joinRoom({
              users: [this.card?.host?.uuid, this.userData?.uuid],
              roomId: this.card?.host?.uuid + this.userData?.uuid,
            });
          } else {
            localStorage.setItem(
              baseUrl.localStorageSelectedChat,
              JSON.stringify({
                first_name: this.card?.host?.first_name,
                last_name: this.card?.host?.last_name,
                u_id: this.card?.host?.uuid,
              })
            );
            this.joinRoom({
              users: [this.card?.host?.uuid, this.userData?.uuid],
              roomId: this.card?.host?.uuid + this.userData?.uuid,
            });
          }
        },
        (err) => {}
      );
  }

  sendChatMessage(roomId: string, message: string): void {
    this.chatService.sendMessage({
      sender: this.card?.host?.uuid,
      room: roomId,
      message: message,
      receiver: this.userData?.uuid,
      listing: this.card?.booking_uuid,
      sender_name: `${this.userData?.first_name} ${this.userData?.last_name}`,
    });
  }
}
