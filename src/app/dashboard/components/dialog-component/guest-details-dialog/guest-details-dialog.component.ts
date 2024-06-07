import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-guest-details-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './guest-details-dialog.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./guest-details-dialog.component.scss'],
})
export class GuestDetailsDialogComponent {
  @Input() data: any;

  constructor(private dialog: MatDialog) {}

  closeDialog() {
    this.dialog.closeAll();
  }
}
