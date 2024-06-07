import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ChartModule } from 'angular-highcharts';
import { AppPublicSidenavRoutingModule } from './app-public-sidenav-routing.module';

@NgModule({
  imports: [
    CommonModule,
    AppPublicSidenavRoutingModule,
    CommonModule,
    MatSidenavModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
    ChartModule,
  ],
})
export class AppPublicSidenavModule {}
