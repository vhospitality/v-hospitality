import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-left-sidenav-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterModule],
  templateUrl: './admin-left-sidenav-list.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./admin-left-sidenav-list.component.scss'],
})
export class AdminLeftSidenavListComponent {
  @Output() PrivatesidenavClose = new EventEmitter();

  public onPrivateSidenavClose = () => {
    this.PrivatesidenavClose.emit();
  };
}
