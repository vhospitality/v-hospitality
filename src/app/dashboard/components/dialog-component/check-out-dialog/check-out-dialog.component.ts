import { CommonModule } from "@angular/common";
import { Component, Input, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { baseUrl } from "../../../../../environments/environment";
import { AuthService } from "../../../../global-services/auth.service";
import { HttpService } from "../../../../global-services/http.service";

@Component({
  selector: "app-check-out-dialog",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./check-out-dialog.component.html",
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ["./check-out-dialog.component.scss"],
})
export class CheckOutDialogComponent {
  @Input() data: any;
  loading: boolean = false;
  disabled: boolean = false;
  dafaultImage: string = baseUrl.defaultImage;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private httpService: HttpService
  ) {
    this.authService.checkExpired();
  }

  onSubmit() {
    this.loading = true;
    this.disabled = true;

    this.httpService
      .updateData(baseUrl.bookings + `/${this?.data?.data?.uuid}`, {
        status: "checked_out",
      })
      .subscribe(
        () => {
          this.loading = false;
          this.disabled = false;

          const data2: any = {
            data: {
              check_out: new Date(),
              check_in: this.data?.data?.check_in,
              amount_paid: this.data?.data?.amount_paid,
              booking_code: this.data?.data?.booking_code,
              guestTotal:
                Number(this?.data?.data?.guests?.adults) +
                Number(this?.data?.data?.guests?.children) +
                Number(this?.data?.data?.guests?.infants),
              listing: {
                pictures:
                  this?.data?.data?.listing?.pictures?.length > 0
                    ? this?.data?.data?.listing?.pictures[0]?.url
                    : this.dafaultImage,
                title: this?.data?.data?.listing?.title,
                description: this?.data?.data?.listing?.description,
                uuid: this?.data?.data?.listing?.uuid,
              },
              host_first_name: this?.data?.data?.host?.first_name,
              host_last_name: this?.data?.data?.host?.last_name,
              listing_uuid: this?.data?.data?.listing?.uuid,
              booking_uuid: this?.data?.data?.uuid,
            },
          };

          (window as any).ttq.track("CheckOutOfHotel");

          this.router.navigate(["/check-out", btoa(JSON.stringify(data2))]);
          this.closeDialog();
        },
        (err) => {
          this.loading = false;
          this.disabled = false;
          this.authService.checkExpired();

          this.snackBar.open(
            err?.error?.message ||
              err?.error?.msg ||
              err?.error?.detail ||
              err?.error?.status ||
              "An error occured!",
            "x",
            {
              duration: 5000,
              panelClass: "error",
              horizontalPosition: "center",
              verticalPosition: "top",
            }
          );
        }
      );
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
