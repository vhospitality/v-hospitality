import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { baseUrl } from '../../../../../environments/environment';
import { AuthService } from '../../../../global-services/auth.service';
import { HttpService } from '../../../../global-services/http.service';

@Component({
  selector: 'app-success-error-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './success-error-dialog.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./success-error-dialog.component.scss'],
})
export class SuccessErrorDialogComponent {
  @Input() data: any;
  loading: boolean = false;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private httpService: HttpService,
    private snackBar: MatSnackBar
  ) {}

  onSubmit() {
    this.loading = true;

    this.httpService
      .postData(baseUrl.cards, { reference: this.data?.reference })
      .subscribe(
        (data: any) => {
          this.loading = false;
          this.snackBar.open('Successfully saved card details', 'x', {
            duration: 3000,
            panelClass: 'success',
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          this.closeDialog();
        },
        () => {
          this.loading = false;
          this.authService.checkExpired();
          this.closeDialog();
        }
      );
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
