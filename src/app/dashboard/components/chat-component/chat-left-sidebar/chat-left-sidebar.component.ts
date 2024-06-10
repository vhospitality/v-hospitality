import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SkeletonModule } from 'primeng/skeleton';
import { Subscription } from 'rxjs';
import { baseUrl } from '../../../../../environments/environment';
import { ChatService } from '../../../../global-services/chat.service';
import { HttpService } from '../../../../global-services/http.service';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';
import { DateAgoPipe } from '../../../pipes/date-ago.pipe';
import { NoDataMessageComponent } from '../../no-data-message/no-data-message.component';

@Component({
  selector: 'app-chat-left-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollPanelModule,
    DateAgoPipe,
    NoDataMessageComponent,
    SkeletonModule,
    AvatarModule,
    AvatarGroupModule,
    LazyLoadImageModule,
  ],
  templateUrl: './chat-left-sidebar.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./chat-left-sidebar.component.scss'],
})
export class ChatLeftSidebarComponent implements OnInit {
  @Output() currentUser = new EventEmitter<any>();
  search: string = '';
  active: string = '';
  rooms: any;
  userData: any = this.service.getProfileMessage();
  clickEventSubscription?: Subscription;
  loading: boolean = false;
  errorMessage: string = 'No chats found at the momemt';
  messages: any;
  defaultImage: string = baseUrl.defaultImage;

  constructor(
    private service: ToggleNavService,
    private httpService: HttpService,
    private chatService: ChatService
  ) {
    this.clickEventSubscription = this.service
      .getIsLoginClickEvent()
      .subscribe(() => {
        this.userData = this.service.getProfileMessage();
        this.getRooms();
      });
  }

  getRooms() {
    if (this.rooms?.length === 0 || !this.rooms) {
      this.loading = true;
    }

    if (this.userData?.uuid) {
      this.httpService
        .getForChat(
          baseUrl?.messagingUrl + `roomsByUserId?user_id=${this.userData?.uuid}`
        )
        .subscribe(
          (res: any) => {
            if (res) {
              res.forEach((element: any) => {
                element.user = element.users.find(
                  (i: any) => i?.u_id !== this.userData?.uuid
                );
              });

              this.rooms = res;
            }
            this.loading = false;
          },
          () => {
            this.loading = false;
          }
        );
    }
  }

  changeActive(data?: any) {
    console.log(data, 'changeActive data');

    if (data) {
      this.active = data?._id || data?.u_id;

      localStorage.setItem(
        baseUrl.localStorageSelectedChat,
        JSON.stringify(data?.user || data)
      );

      this.currentUser.emit(data?.user || data);
      this.currentUser.emit(data?.user || data);

      this.joinRoom(
        `${this.userData?.first_name} ${this.userData?.last_name}`,
        data?.roomId,
        data?.users?.find((name: any) => name?.u_id !== this.userData?.uuid)
      );
    }

    this.service.changeRoom(data);
  }

  joinRoom(username: string, roomId: string, user_id: string): void {
    this.service.sendNotificationClickEvent(undefined);
    this.chatService.joinRoom({
      user: username,
      room: roomId,
      user_id: user_id,
      uuid: this.userData?.uuid,
    });
    this.chatService.joinRoom({
      user: username,
      room: roomId,
      user_id: user_id,
      uuid: this.userData?.uuid,
    });
  }

  ngOnInit(): void {
    this.getRooms();

    this.chatService.getMessage().subscribe((data) => {
      this.rooms.filter((n: any, index: number) => {
        if (n?.roomId == data?.room) {
          this.rooms[index].updatedAt = new Date();
          this.rooms[index].lastMessage = `${
            data?.sender == this.userData?.uuid ? 'You:' : ''
          } ${data?.message}`;
        }

        if (n?._id === data?._id) {
          this.rooms.splice(index, 1);
          this.rooms.unshift(n);
        }
      });
    });
  }

  getMessages() {
    this.httpService
      .getForChat(
        baseUrl.messagingUrl + `messageByRoomId?roomId=${this.active}`
      )
      .subscribe(
        (data: any) => {
          this.messages = data;
        },
        () => {
          this.errorMessage = 'Error fetching messages';
        }
      );
  }

  formatName(first_name: any, last_name: any) {
    let displayname1 = first_name?.toUpperCase()?.replaceAll(' ', 'V');
    let displayname2 = last_name?.toUpperCase()?.replaceAll(' ', '') || 'HO';
    let displayname3 = displayname1[0] + '' + displayname2[0];
    return displayname3;
  }
}
