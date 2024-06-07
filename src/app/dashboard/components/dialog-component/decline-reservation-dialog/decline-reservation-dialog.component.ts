import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { baseUrl } from '../../../../../environments/environment';
import { AuthService } from '../../../../global-services/auth.service';
import { HttpService } from '../../../../global-services/http.service';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-decline-reservation-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './decline-reservation-dialog.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./decline-reservation-dialog.component.scss'],
})
export class DeclineReservationDialogComponent {
  @Input() data: any;
  currentId: any = { name: 'Booking Date Inconvenient for me', id: 1 };
  loading: boolean = false;

  questions: any[] = [
    { name: 'Booking Date Inconvenient for me', id: 1 },
    { name: 'I am uncomfortable with guest', id: 2 },
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
      .updateData(baseUrl.reservations + `/${this.data?.data?.uuid}`, {
        reason_for_decline: this.currentId?.name,
        status: 'declined',
      })
      .subscribe(
        () => {
          this.loading = false;
          this.snackBar.open('Successfully declined reservation', 'x', {
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

  openDialog(data: any, type: string) {
    this.dialog.closeAll();
    this.dialog.open(DialogComponent, {
      data: {
        type: type,
        data: data,
      },
    });
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
