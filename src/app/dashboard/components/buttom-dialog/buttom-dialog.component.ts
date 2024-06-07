import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import {
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { ToggleNavService } from '../../dashboard-service/toggle-nav.service';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'app-buttom-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatBottomSheetModule,
    ToastComponent,
  ],
  templateUrl: './buttom-dialog.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./buttom-dialog.component.scss'],
})
export class ButtomDialogComponent {
  constructor(
    private _bottomSheetRef: MatBottomSheetRef<ButtomDialogComponent>,
    private service: ToggleNavService
  ) {}

  close(): void {
    this._bottomSheetRef.dismiss();
  }

  unsubscribe() {
    this.service.sendToastClickEvent({
      success: true,
      message: 'Successfully unscubscribed from the newsletter',
    });
    this.close();
  }
}
