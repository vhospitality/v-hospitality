import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { baseUrl } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket: Socket | any;
  private url = baseUrl.messagingUrl2;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.socket = io(this.url, {
        transports: ['websocket', 'polling', 'flashsocket'],
      });
    }
  }

  joinRoom(data: any) {
    if (isPlatformBrowser(this.platformId)) {
      this.socket.emit('join', data);
    }
  }

  sendMessage(data: any): void {
    if (isPlatformBrowser(this.platformId)) {
      this.socket.emit('message', data);
    }
  }

  getMessage(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on('new message', (data: any) => {
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      };
    });
  }
}
