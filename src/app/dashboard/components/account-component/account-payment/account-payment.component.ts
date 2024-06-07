import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';
import { AccountPaymentFormComponent } from '../account-payment-form/account-payment-form.component';
import { AccountPaymentSavedCardsComponent } from '../account-payment-saved-cards/account-payment-saved-cards.component';

@Component({
  selector: 'app-account-payment',
  standalone: true,
  imports: [
    CommonModule,
    AccountPaymentFormComponent,
    AccountPaymentSavedCardsComponent,
  ],
  templateUrl: './account-payment.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./account-payment.component.scss'],
})
export class AccountPaymentComponent {
  @Input() userData: any;
  loading: boolean = false;
  disabled: boolean = false;
  actionType: string = 'save';

  clickEventSubscription?: Subscription;

  constructor(private service: ToggleNavService) {
    this.clickEventSubscription = this.service
      .getPaymentFormClickEvent()
      .subscribe((data: any) => {
        if (data?.type) {
          this.actionType = data?.type;
        }
        if (data?.actionType === 'submit') {
          this.loading = true;
          this.disabled = true;
        }
        if (data?.actionType === 'submited' || data?.actionType === 'error') {
          this.loading = false;
          this.disabled = false;
        }
      });
  }

  onSubmit() {
    this.service.sendPaymentFormClickEvent({
      actionType: 'submit',
    });
  }
}
