import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { Subscription } from 'rxjs';
import { baseUrl } from '../../../../../environments/environment';
import { ChatService } from '../../../../global-services/chat.service';
import { HttpService } from '../../../../global-services/http.service';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-accommodation-detail-host',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LazyLoadImageModule,
    MatMenuModule,
    MatButtonModule,
  ],
  templateUrl: './accommodation-detail-host.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./accommodation-detail-host.component.scss'],
})
export class AccommodationDetailHostComponent {
  @Input() data: any;
  userData: any = this.service.getProfileMessage();
  defaultImage: string = baseUrl.defaultImage;
  clickEventSubscription?: Subscription;
  loading: boolean = false;

  constructor(
    private service: ToggleNavService,
    private router: Router,
    private httpService: HttpService,
    private snackBar: MatSnackBar,
    private chatService: ChatService,
    private dialog: MatDialog
  ) {
    this.clickEventSubscription = this.service
      .getIsLoginClickEvent()
      .subscribe(() => {
        this.userData = this.service.getProfileMessage();
      });
  }

  sendMessage() {
    this.loading = true;
    // check if user exist for messaging
    this.httpService
      .getForChat(baseUrl.messagingUrl + `user?u_id=${this.userData?.uuid}`)
      .subscribe(
        () => {
          if (this.data?.host?.uuid === this.userData?.uuid) {
            localStorage.setItem(
              baseUrl.localStorageSelectedChat,
              JSON.stringify({
                first_name: this.data?.user?.first_name,
                last_name: this.data?.user?.last_name,
                u_id: this.data?.user?.uuid,
              })
            );

            this.joinRoom({
              users: [this.data?.host?.uuid, this.data?.user?.uuid],
              roomId: this.data?.host?.uuid + this.data?.user?.uuid,
            });
          } else {
            localStorage.setItem(
              baseUrl.localStorageSelectedChat,
              JSON.stringify({
                first_name: this.data?.host?.first_name,
                last_name: this.data?.host?.last_name,
                u_id: this.data?.host?.uuid,
              })
            );
            this.joinRoom({
              users: [this.data?.host?.uuid, this.data?.user?.uuid],
              roomId: this.data?.host?.uuid + this.data?.user?.uuid,
            });
          }

          localStorage.setItem(
            baseUrl.localStorageSelectedBooking,
            JSON.stringify(this.data?.uuid)
          );
        },
        (err) => {
          if (err?.status == 404 || err?.status == 400) {
            this.registerForMessaging();
          } else {
            this.loading = false;
          }
        }
      );
  }

  joinRoom(roomDetails: any) {
    this.httpService
      .registerForChat(baseUrl.messagingUrl + 'rooms', roomDetails)
      .subscribe(
        (data: any) => {
          this.loading = false;
          this.chatService.joinRoom(roomDetails);
          this.sendChatMessage(
            data?.roomId,
            `Hi ${
              this.userData?.uuid == this.data?.host?.uuid
                ? this.data?.user?.first_name
                : this.data?.host?.first_name
            }`
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
          this.router.navigate(['/chat']);
        },
        () => {
          this.snackBar.open(
            'Unable to process your request, please try again',
            'x',
            {
              duration: 5000,
              panelClass: 'error',
              horizontalPosition: 'center',
              verticalPosition: 'top',
            }
          );
          this.loading = false;
        }
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
        () => {
          if (this.data?.host?.uuid === this.userData?.uuid) {
            localStorage.setItem(
              baseUrl.localStorageSelectedChat,
              JSON.stringify({
                first_name: this.data?.user?.first_name,
                last_name: this.data?.user?.last_name,
                u_id: this.data?.user?.uuid,
              })
            );

            this.joinRoom({
              users: [this.data?.host?.uuid, this.data?.user?.uuid],
              roomId: this.data?.host?.uuid + this.data?.user?.uuid,
            });
          } else {
            localStorage.setItem(
              baseUrl.localStorageSelectedChat,
              JSON.stringify({
                first_name: this.data?.host?.first_name,
                last_name: this.data?.host?.last_name,
                u_id: this.data?.host?.uuid,
              })
            );
            this.joinRoom({
              users: [this.data?.host?.uuid, this.data?.user?.uuid],
              roomId: this.data?.host?.uuid + this.data?.user?.uuid,
            });
          }

          localStorage.setItem(
            baseUrl.localStorageSelectedBooking,
            JSON.stringify(this.data?.uuid)
          );
        },
        (err) => {
          this.snackBar.open(
            'Unable to process your request, please try again',
            'x',
            {
              duration: 5000,
              panelClass: 'error',
              horizontalPosition: 'center',
              verticalPosition: 'top',
            }
          );
          this.loading = false;
        }
      );
  }

  sendChatMessage(roomId: string, message: string): void {
    this.chatService.sendMessage({
      sender: this.userData?.uuid,
      room: roomId,
      message: message,
      listing: this.data?.uuid,
      receiver:
        this.userData?.uuid === this.data?.user?.uuid
          ? this.data?.host?.uuid
          : this.data?.user?.uuid,
    });

    this.httpService
      .registerForChat(baseUrl.messagingUrl + 'message', {
        sender: this.userData?.uuid,
        room: roomId,
        message: message,
        listing: this.data?.uuid,
        receiver:
          this.userData?.uuid === this.data?.user?.uuid
            ? this.data?.host?.uuid
            : this.data?.user?.uuid,
      })
      .subscribe(
        () => {},
        () => {}
      );
  }

  updateReservation(uuid: string, status: string) {
    this.loading = true;

    this.httpService
      .updateData(baseUrl.reservations + `/${uuid}`, {
        status: status,
      })
      .subscribe(
        () => {
          this.loading = false;
          this.snackBar.open('Successfully updated reservation', 'x', {
            duration: 3000,
            panelClass: 'success',
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });

          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        (err) => {
          this.loading = false;
          this.snackBar.open(
            err?.error?.message ||
              err?.error?.msg ||
              err?.error?.detail ||
              err?.error?.status ||
              'An error occured!',
            'x',
            {
              duration: 3000,
              panelClass: 'error',
              horizontalPosition: 'center',
              verticalPosition: 'top',
            }
          );
        }
      );
  }

  openDialog(data: any, type: string) {
    this.dialog.closeAll();
    let dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: type || 'dialog',
        data: data,
      },
    });

    // after dialog close
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.loading) {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    });
  }

  displayDecline(data: any) {
    const date1: any = new Date(data?.check_in);
    const date2: any = new Date();
    // Calculate the difference in milliseconds
    const differenceInMilliseconds = Math.abs(date2 - date1);
    // Convert milliseconds to hours
    const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);
    if (Number(differenceInHours) >= 24) {
      return true;
    } else {
      return false;
    }
  }
}
