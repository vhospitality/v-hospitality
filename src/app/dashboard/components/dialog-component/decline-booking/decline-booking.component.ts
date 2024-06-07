import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { baseUrl } from '../../../../../environments/environment';
import { AuthService } from '../../../../global-services/auth.service';
import { HttpService } from '../../../../global-services/http.service';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-decline-booking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './decline-booking.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./decline-booking.component.scss'],
})
export class DeclineBookingComponent {
  @Input() data: any;
  loading: boolean = false;
  disabled: boolean = false;
  currentId: any = { name: 'Booking Date Inconvenient for me', id: 1 };

  questions: any[] = [
    { name: 'Booking Date Inconvenient for me', id: 1 },
    { name: 'I am uncomfortable with host', id: 2 },
    { name: 'I would rather not say', id: 3 },
  ];

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
    this.httpService
      .updateData(baseUrl.bookings + `/${this.data?.data?.uuid}`, {
        reason_for_cancel: this.currentId?.name,
        status: 'cancelled',
      })
      .subscribe(
        () => {
          this.loading = false;
          this.snackBar.open('Successfully declined booking', 'x', {
            duration: 3000,
            panelClass: 'success',
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });

          this.dialogRef.close({
            loading: true,
          });
        },
        (err) => {
          this.loading = false;
          this.snackBar.open(
            err?.error?.message ||
              err?.error?.msg ||
              err?.error?.detail ||
              err?.error?.status ||
              'An error occured!',
            'x',
            {
              duration: 3000,
              panelClass: 'error',
              horizontalPosition: 'center',
              verticalPosition: 'top',
            }
          );
        }
      );
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
