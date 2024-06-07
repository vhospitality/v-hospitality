import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SelectComponent } from './select.component';

@Injectable({
  providedIn: 'root',
})
export class SelectService {
  private parentInstance: SelectComponent | any;
  private subject = new Subject<any>();
  message: string | undefined;

  init(parent: SelectComponent) {
    this.parentInstance = parent;
  }

  getParent(): SelectComponent {
    return this.parentInstance;
  }

  sendSelectClickEvent(type?: string, id?: number) {
    this.subject.next({ type: type, id: id });
  }

  getSelectClickEvent(): Observable<any> {
    return this.subject.asObservable();
  }

  setSelectMessage(data: any) {
    this.message = data;
  }

  getSelectMessage() {
    return this.message;
  }
}
