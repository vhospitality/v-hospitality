import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  PLATFORM_ID,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkeletonModule } from 'primeng/skeleton';
import { Subscription } from 'rxjs';
import { baseUrl } from '../../../../../environments/environment';
import { ChatService } from '../../../../global-services/chat.service';
import { HttpService } from '../../../../global-services/http.service';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';
import { DateAgoPipe } from '../../../pipes/date-ago.pipe';
import { NoDataMessageComponent } from '../../no-data-message/no-data-message.component';
import { ChatHeaderComponent } from '../chat-header/chat-header.component';

@Component({
  selector: 'app-chat-content',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ChatHeaderComponent,
    DateAgoPipe,
    NoDataMessageComponent,
    SkeletonModule,
  ],
  templateUrl: './chat-content.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./chat-content.component.scss'],
})
export class ChatContentComponent implements AfterViewInit {
  @ViewChild('target', { static: true })
  target!: ElementRef<HTMLDivElement>;

  @ViewChild('target2', { static: true })
  target2!: ElementRef<HTMLDivElement>;

  @Input() currentUser: any;
  @Input() listingDetails: any;
  // @ViewChild('input') input: ElementRef | any;
  userData: any = this.service.getProfileMessage();
  toggled: boolean = false;
  message: string = '';
  clickEventSubscription?: Subscription;
  messages: any[] = [];
  loading: boolean = false;
  errorMessage: string = 'No messages found';
  currentRoom: any;
  listingId: any;

  constructor(
    private chatService: ChatService,
    private service: ToggleNavService,
    private httpService: HttpService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  join(username: string, roomId: string): void {
    this.chatService.joinRoom({ user: username, room: roomId });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.clickEventSubscription = this.service
        .getIsLoginClickEvent()
        .subscribe(() => {
          this.userData = this.service.getProfileMessage();
        });

      this.chatService.getMessage().subscribe((data) => {
        if (data?.sender !== this.userData?.uuid) {
          if (this.messages?.length > 0) {
            this.messages.push(data);
          } else {
            this.messages = [data];
          }
        }

        if (data?.receiver === this.userData?.uuid) {
          if (!('Notification' in window)) {
            return;
          }
          this.playSound();
        }
        this.scrollToBottom();
      });

      let currentRoom = JSON.parse(localStorage.getItem(baseUrl.rooms) as any);
      if (currentRoom?.length > 0 && currentRoom) {
        this.currentRoom = currentRoom[0];
      }

      this.service.currentRoom?.subscribe((room: any) => {
        if (room?.roomId !== currentRoom?.roomId) {
          this.currentRoom = room;
          this.messages = [];
          this.getMessages();
        }
      });
    }
  }

  getMessages() {
    if (this.messages?.length === 0) {
      this.loading = true;

      this.httpService
        .getForChat(
          baseUrl.messagingUrl +
            `messageByRoomId?roomId=${this.currentRoom?.roomId}`
        )
        .subscribe(
          (data: any) => {
            this.messages = data;
            this.loading = false;

            const listing = data
              .filter((entry: any) => entry.listing !== undefined)
              .reduce((prev: any, current: any) =>
                new Date(prev.createdAt) > new Date(current.createdAt)
                  ? prev
                  : current
              );

            if (listing) {
              this.service.sendFoundListingClickEvent(listing);
              this.listingId = listing;
            }

            setTimeout(() => {
              this.scrollToBottom();
            }, 100);
          },
          (err) => {
            this.errorMessage = 'Error fetching messages';
            this.loading = false;
          }
        );
    }
  }

  onFocus() {
    this.toggled = false;
  }

  handleSelection(event: any) {
    this.message += event.char;
  }

  sendMessage(): void {
    const dataToSend = {
      sender: this.userData?.uuid,
      room: this.currentRoom?.roomId,
      message: this.message,
      listing: this.listingDetails?.uuid || this.listingId?.listing,
      receiver: this.currentUser?.u_id || this.currentUser?._id,
      sender_name: `${this.userData?.first_name} ${this.userData?.last_name}`,
    };

    this.chatService.sendMessage(dataToSend);
    this.messages.push(dataToSend);
    this.scrollToBottom();
    this.message = '';
    this.playSentMessageSound();
  }

  playSound(): void {
    let src = '/assets/mp3/message.mp3';
    let audio = new Audio(src);
    audio.play();
  }

  playSentMessageSound(): void {
    let src = '/assets/mp3/sent.mp3';
    let audio = new Audio(src);
    audio.play();
  }

  scrollToBottom(): void {
    setTimeout(() => {
      this.target?.nativeElement.scrollIntoView();
      this.target2.nativeElement.scrollTo(
        0,
        this.target2.nativeElement.scrollHeight
      );
    }, 1000);
  }
}
