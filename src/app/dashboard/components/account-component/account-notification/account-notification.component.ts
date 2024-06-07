import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SkeletonModule } from 'primeng/skeleton';
import { baseUrl } from '../../../../../environments/environment';
import { AuthService } from '../../../../global-services/auth.service';
import { HttpService } from '../../../../global-services/http.service';
import { ToggleNavService } from '../../../dashboard-service/toggle-nav.service';
import { ButtomDialogComponent } from '../../buttom-dialog/buttom-dialog.component';

@Component({
  selector: 'app-account-notification',
  standalone: true,
  imports: [
    CommonModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    SkeletonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './account-notification.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./account-notification.component.scss'],
})
export class AccountNotificationComponent implements OnInit {
  @Input() userData: any;
  // travel
  travelBrowserNotification: boolean = false;
  travelEmailNotification: boolean = false;
  travelSmsNotification: boolean = false;
  // v-hospitality
  hospitalityBrowserNotification: boolean = false;
  hospitalityEmailNotification: boolean = false;
  hospitalitySmsNotification: boolean = false;
  // reminders
  reminderBrowserNotification: boolean = false;
  reminderEmailNotification: boolean = false;
  reminderSmsNotification: boolean = false;
  // subscribe
  subscribeNotification: boolean = false;
  loading: boolean = false;
  loadingNotification: boolean = false;

  touched: boolean = false;

  constructor(
    private _bottomSheet: MatBottomSheet,
    private authService: AuthService,
    private service: ToggleNavService,
    private httpService: HttpService,
    private snackBar: MatSnackBar
  ) {
    this.authService.checkExpired();
  }

  openBottomSheet(): void {
    if (this.userData?.settings?.unsubscribe_from_marketing_emails) {
      this._bottomSheet.open(ButtomDialogComponent);
    }
  }

  getProfileDetails() {
    this.loading = true;
    this.httpService.getAuthSingle(baseUrl.profileDetails).subscribe(
      (data: any) => {
        this.userData = data?.data;
        this.updateNotificationSettings();
        this.service.setProfileMessage(data?.data);
        this.loading = false;
      },
      (err) => {
        this.authService.checkExpired();
        this.loading = false;
      }
    );
  }

  updateNotificationSettings() {
    // travel
    this.travelBrowserNotification =
      this.userData?.settings?.tips_offers?.browser;
    this.travelEmailNotification = this.userData?.settings?.tips_offers?.email;
    this.travelSmsNotification = this.userData?.settings?.tips_offers?.sms;
    // v-hospitality
    this.hospitalityBrowserNotification =
      this.userData?.settings?.v_updates?.browser;
    this.hospitalityEmailNotification =
      this.userData?.settings?.v_updates?.email;
    this.hospitalitySmsNotification = this.userData?.settings?.v_updates?.sms;
    // reminders
    this.reminderBrowserNotification =
      this.userData?.settings?.reminders?.browser;
    this.reminderEmailNotification = this.userData?.settings?.reminders?.email;
    this.reminderSmsNotification = this.userData?.settings?.reminders?.sms;
    // subscribe
    this.subscribeNotification =
      this.userData?.settings?.unsubscribe_from_marketing_emails;
  }

  saveNotification() {
    this.loadingNotification = true;
    this.httpService
      .updateData(baseUrl.profileDetails, {
        settings: {
          tips_offers: {
            email: this.travelEmailNotification,
            sms: this.travelSmsNotification,
            browser: this.travelBrowserNotification,
          },

          v_updates: {
            email: this.hospitalityEmailNotification,
            sms: this.hospitalitySmsNotification,
            browser: this.hospitalityBrowserNotification,
          },

          reminders: {
            email: this.reminderEmailNotification,
            sms: this.reminderSmsNotification,
            browser: this.reminderBrowserNotification,
          },

          unsubscribe_from_marketing_emails: this.subscribeNotification,
        },
      })
      .subscribe(
        (data: any) => {
          this.getProfileDetails();
          this.snackBar.open('Success', 'x', {
            duration: 3000,
            panelClass: 'success',
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          this.loadingNotification = false;
        },
        (err) => {
          this.snackBar.open(
            err?.error?.message ||
              err?.error?.msg ||
              err?.error?.detail ||
              err?.error?.status ||
              'An error occured!',
            'x',
            {
              duration: 5000,
              panelClass: 'error',
              horizontalPosition: 'center',
              verticalPosition: 'top',
            }
          );
          this.loadingNotification = false;
        }
      );
  }

  ngOnInit(): void {
    if (!this.userData) {
      this.getProfileDetails();
    } else {
      this.userData = this.service.getProfileMessage();
    }

    this.updateNotificationSettings();
  }
}
