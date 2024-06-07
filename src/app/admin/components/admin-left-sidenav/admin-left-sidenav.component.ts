import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../../../global-services/auth.service';
import { AdminLeftSidenavListComponent } from '../admin-left-sidenav-list/admin-left-sidenav-list.component';

@Component({
  selector: 'app-app-private-sidenav',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatSidenavModule,
    RouterModule,
    LoadingBarRouterModule,
    AdminLeftSidenavListComponent,
  ],
  templateUrl: './admin-left-sidenav.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./admin-left-sidenav.component.scss'],
})
export class AdminLeftSidenavComponent {
  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService
  ) {}

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe([
      // Breakpoints.Tablet,
      // Breakpoints.TabletLandscape,
      // Breakpoints.TabletPortrait,
      // Breakpoints.Handset,
      // Breakpoints.HandsetLandscape,
      // Breakpoints.HandsetPortrait,
      '(max-width: 1279px)',
    ])
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  logout() {
    this.authService.logout();
  }
}
