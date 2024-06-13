import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarModule } from 'primeng/sidebar';
import { Observable, Subscription, map, shareReplay } from 'rxjs';
import { ToggleNavService } from '../../dashboard-service/toggle-nav.service';
import { AppPublicSidenavListComponent } from '../app-public-sidenav-list/app-public-sidenav-list.component';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'app-app-public-sidenav',
  standalone: true,
  imports: [
    CommonModule,
    AppPublicSidenavListComponent,
    RouterModule,
    SidebarModule,
    ToastComponent,
  ],
  templateUrl: './app-public-sidenav.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./app-public-sidenav.component.scss'],
})
export class AppPublicSidenavComponent {
  sidebarVisible: boolean = false;
  clickEventSubscription?: Subscription;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private shared: ToggleNavService
  ) {
    this.clickEventSubscription = this.shared
      .getHeaderClickEvent()
      .subscribe(() => {
        this.sidebarVisible = !this.sidebarVisible;
      });
  }

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(['(max-width: 1200px)'])
    .pipe(
      map((result: any) => result.matches),
      shareReplay()
    );
}
