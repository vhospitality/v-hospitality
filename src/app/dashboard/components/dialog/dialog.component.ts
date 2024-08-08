import { CommonModule } from "@angular/common";
import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { ToggleNavService } from "../../dashboard-service/toggle-nav.service";
import { CheckInComponent } from "../dialog-component/check-in/check-in.component";
import { CheckOutDialogComponent } from "../dialog-component/check-out-dialog/check-out-dialog.component";
import { DeclineBookingComponent } from "../dialog-component/decline-booking/decline-booking.component";
import { DeclineReservationDialogComponent } from "../dialog-component/decline-reservation-dialog/decline-reservation-dialog.component";
import { DialogLoginComponent } from "../dialog-component/dialog-login/dialog-login.component";
import { DialogSignupConfirmComponent } from "../dialog-component/dialog-signup-confirm/dialog-signup-confirm.component";
import { DialogSignupDetailsComponent } from "../dialog-component/dialog-signup-details/dialog-signup-details.component";
import { DialogSignupPhoneEmailComponent } from "../dialog-component/dialog-signup-phone-email/dialog-signup-phone-email.component";
import { DialogSignupThankyouComponent } from "../dialog-component/dialog-signup-thankyou/dialog-signup-thankyou.component";
import { DialogSignupUploadComponent } from "../dialog-component/dialog-signup-upload/dialog-signup-upload.component";
import { FilterDialogComponent } from "../dialog-component/filter-dialog/filter-dialog.component";
import { GuestDetailsDialogComponent } from "../dialog-component/guest-details-dialog/guest-details-dialog.component";
import { HostChangeReservationDialogComponent } from "../dialog-component/host-change-reservation-dialog/host-change-reservation-dialog.component";
import { IdentityVerificationComponent } from "../dialog-component/identity-verification/identity-verification.component";
import { InitiatePayoutDialogComponent } from "../dialog-component/initiate-payout-dialog/initiate-payout-dialog.component";
import { OtpPayoutDialogComponent } from "../dialog-component/otp-payout-dialog/otp-payout-dialog.component";
import { PayWithCardDialogComponent } from "../dialog-component/pay-with-card-dialog/pay-with-card-dialog.component";
import { PlanUpgradeComponent } from "../dialog-component/plan-upgrade/plan-upgrade.component";
import { SelectCardDialogComponent } from "../dialog-component/select-card-dialog/select-card-dialog.component";
import { SuccessErrorDialogComponent } from "../dialog-component/success-error-dialog/success-error-dialog.component";
import { ReviewDialogComponent } from "../review-component/review-dialog/review-dialog.component";
import { ToggleDateDialogComponent } from "../dialog-component/toggle-date-dialog/toggle-date-dialog.component";
import { DialogSignupAffiliateComponent } from "../dialog-component/dialog-signup-affiliate/dialog-signup-affiliate.component";

@Component({
  selector: "app-dialog",
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    DialogSignupConfirmComponent,
    DialogSignupDetailsComponent,
    DialogSignupPhoneEmailComponent,
    DialogSignupThankyouComponent,
    DialogSignupUploadComponent,
    DialogLoginComponent,
    ReviewDialogComponent,
    HostChangeReservationDialogComponent,
    SuccessErrorDialogComponent,
    InitiatePayoutDialogComponent,
    OtpPayoutDialogComponent,
    PayWithCardDialogComponent,
    SelectCardDialogComponent,
    DeclineReservationDialogComponent,
    FilterDialogComponent,
    IdentityVerificationComponent,
    CheckOutDialogComponent,
    CheckInComponent,
    DeclineBookingComponent,
    GuestDetailsDialogComponent,
    PlanUpgradeComponent,
    ToggleDateDialogComponent,
    DialogSignupAffiliateComponent,
  ],
  templateUrl: "./dialog.component.html",
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ["./dialog.component.scss"],
})
export class DialogComponent {
  requestType: string = "default";
  requestMessage: string = "Sign up";
  datas: any;
  clickEventSubscription?: Subscription;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: ToggleNavService
  ) {
    dialogRef.disableClose = true;

    if (this.data?.type === "login2") {
      this.requestMessage = "Log in";
    }

    this.service.getSignupClickEvent().subscribe((data2: any) => {
      this.requestType = data2?.requestType || "default";
      this.requestMessage = data2?.requestMessage || "Sign up";
      this.datas = data2;
    });

    this.clickEventSubscription = this.service
      .getSignupClickEvent()
      .subscribe((data2: any) => {
        this.requestType = data2?.requestType;
        this.requestMessage = data2?.requestMessage;
        this.datas = data2;
      });
  }
}
