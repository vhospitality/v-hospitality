import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { ToggleNavService } from '../../dashboard-service/toggle-nav.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './toast.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  clickEventSubscription?: Subscription;

  constructor(
    private messageService: MessageService,
    private service: ToggleNavService
  ) {
    this.service.getToastClickEvent().subscribe((data: any) => {
      if (data?.success) {
        this.messageService.add({
          key: 'tc',
          severity: 'success',
          summary: data?.summary,
          detail: data?.message,
        });
      } else {
        this.messageService.add({
          key: 'tc',
          severity: 'error',
          summary: data?.summary,
          detail: data?.message,
        });
      }
    });
  }
}
