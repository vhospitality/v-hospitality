import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-verify-email-success-error',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterModule],
  templateUrl: './verify-email-success-error.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./verify-email-success-error.component.scss'],
})
export class VerifyEmailSuccessErrorComponent implements OnInit {
  @Input() data: any;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  openDialog(data: any, type: string) {
    this.dialog.closeAll();
    this.dialog.open(DialogComponent, {
      data: {
        type: type,
        data: data,
      },
    });
  }
}
