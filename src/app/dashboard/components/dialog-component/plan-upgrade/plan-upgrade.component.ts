import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { baseUrl } from '../../../../../environments/environment';
import { AuthService } from '../../../../global-services/auth.service';
import { HttpService } from '../../../../global-services/http.service';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';

@Component({
  selector: 'app-plan-upgrade',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plan-upgrade.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./plan-upgrade.component.scss'],
})
export class PlanUpgradeComponent {
  loading: boolean = false;
  disabled: boolean = false;
  dafaultImage: string = baseUrl.defaultImage;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    private service: ToggleNavService,
    private snackBar: MatSnackBar,
    private httpService: HttpService
  ) {
    this.authService.checkExpired();
  }

  redirectToSubscription() {
    this.router.navigate(['/host-subscription/subscription']);
    this.dialog.closeAll();
  }

  createSubscription() {
    const userData: any = this.service.getProfileMessage();

    const subscriptions: any = this.service.getSubscriptionsMessage();
    const findFreemium = subscriptions?.data?.find(
      (subscription: any) => subscription?.name?.toLowerCase() === 'freemium'
    );

    // Check for necessary conditions early to avoid deep nesting
    if (!userData || !findFreemium) {
      this.dialog.closeAll();
      return; // Early exit if conditions are not met
    }

    const userHasFreemium =
      userData?.subscription?.subscription_type?.toLowerCase() === 'freemium';
    const userHasSubscription = !!userData?.subscription?.subscription_type;

    if (userHasFreemium || (userHasSubscription && !userHasFreemium)) {
      // If the user already has a 'freemium' subscription or any subscription other than 'freemium'
      this.dialog.closeAll();
    } else if (!userHasSubscription) {
      // If the user doesn't have any subscription
      this.subscribeToFreemium(findFreemium.uuid);
    }
  }

  subscribeToFreemium(freemiumUuid: string) {
    this.loading = true;
    this.httpService
      .postData(baseUrl.free_subscription + `/${freemiumUuid}`, {})
      .subscribe(
        (data: any) => {
          this.snackBar.open(
            data?.message || 'Successfully subscribed to free plan',
            'x',
            {
              duration: 3000,
              panelClass: 'success',
              horizontalPosition: 'center',
              verticalPosition: 'top',
            }
          );
        },
        (error) => {
          console.error(error);
          this.snackBar.open('An error occurred during subscription.', 'x', {
            duration: 3000,
            panelClass: 'error',
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        },
        () => {
          this.loading = false;
          this.dialog.closeAll();
        }
      );
  }

  closeDialog() {
    this.createSubscription();
  }
}
