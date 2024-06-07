import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  message: string | undefined;
  private subject = new Subject<any>();

  constructor() {}

  setProfileMessage(data: any) {
    this.message = data;
  }

  getProfileMessage() {
    return this.message;
  }

  sendClickEvent() {
    this.subject.next(null);
  }

  getClickEvent(): Observable<any> {
    return this.subject.asObservable();
  }
}
