import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminRoutingModule } from './admin-left-sidenav-routing.module';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatSidenavModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
  ],
})
export class AdminLeftSidenavModule {}
