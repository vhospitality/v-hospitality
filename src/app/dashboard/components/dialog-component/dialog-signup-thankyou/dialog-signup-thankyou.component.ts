import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-dialog-signup-thankyou',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog-signup-thankyou.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./dialog-signup-thankyou.component.scss'],
})
export class DialogSignupThankyouComponent {
  @Input() data: any;

  constructor(private dialog: MatDialog) {}

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
    // this.router.navigate(['/forget-password']);
  }
}
