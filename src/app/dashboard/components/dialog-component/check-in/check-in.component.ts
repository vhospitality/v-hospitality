import { CommonModule } from "@angular/common";
import { Component, Input, ViewEncapsulation } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { baseUrl } from "../../../../../environments/environment";
import { AuthService } from "../../../../global-services/auth.service";
import { HttpService } from "../../../../global-services/http.service";
import { DialogComponent } from "../../dialog/dialog.component";

@Component({
  selector: "app-check-in",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./check-in.component.html",
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ["./check-in.component.scss"],
})
export class CheckInComponent {
  @Input() data: any;
  loading: boolean = false;
  disabled: boolean = false;
  dafaultImage: string = baseUrl.defaultImage;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private httpService: HttpService,
    public dialogRef: MatDialogRef<DialogComponent>
  ) {
    this.authService.checkExpired();
  }

  onSubmit() {
    this.loading = true;
    this.disabled = true;

    this.httpService
      .updateData(baseUrl.bookings + `/${this?.data?.data?.uuid}`, {
        status: "checked_in",
      })
      .subscribe(
        () => {
          this.loading = false;
          this.disabled = false;
          this.snackBar.open("Check in successful!", "x", {
            duration: 3000,
            panelClass: "success",
            horizontalPosition: "center",
            verticalPosition: "top",
          });

          (window as any).ttq.track("CheckIntoHotel");

          this.dialogRef.close({
            loading: true,
          });
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
