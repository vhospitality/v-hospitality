import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import {
  LAZYLOAD_IMAGE_HOOKS,
  LazyLoadImageModule,
  ScrollHooks,
} from 'ng-lazyload-image';
import { BadgeModule } from 'primeng/badge';
import { InputSwitchModule } from 'primeng/inputswitch';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { Subscription } from 'rxjs';
import { baseUrl } from '../../../../environments/environment';
import { AuthService } from '../../../global-services/auth.service';
import { HttpService } from '../../../global-services/http.service';
import { ToggleNavService } from '../../dashboard-service/toggle-nav.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-app-public-sidenav-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    OverlayPanelModule,
    BadgeModule,
    LazyLoadImageModule,
    InputSwitchModule,
    InputSwitchModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './app-public-sidenav-list.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  providers: [{ provide: LAZYLOAD_IMAGE_HOOKS, useClass: ScrollHooks }],
  styleUrls: ['./app-public-sidenav-list.component.scss'],
})
export class AppPublicSidenavListComponent {
  wishlist: any;
  clickEventSubscription?: Subscription;
  userData: any;
  roles: any[] = [];
  loading: boolean = false;
  isLogin: boolean = false;
  defaultImage: string = baseUrl?.defaultProfileImage;
  switchGuest: boolean = true;

  constructor(
    private authService: AuthService,
    public shared: ToggleNavService,
    private dialog: MatDialog,
    private service: ToggleNavService,
    private httpService: HttpService,
    private snackBar: MatSnackBar
  ) {
    this.checkIfLogin();

    this.userData = this.service.getProfileMessage();

    if (!this.userData) {
      this.getProfileDetails();
    } else {
      for (let r of this.userData?.roles) {
        this.roles.push(r?.name?.toLowerCase());
      }
    }

    this.clickEventSubscription = this.service
      .getIsLoginClickEvent()
      .subscribe(() => {
        this.checkIfLogin();
      });

    this.wishlist = this.service.getWishlistMessage();
  }

  closeSidenav() {
    this.shared.sendHeaderClickEvent();
  }

  checkIfLogin() {
    this.isLogin = this.authService.isLoggedIn();
    this.userData = this.service.getProfileMessage();
    if (!this.userData) {
      this.getProfileDetails();
    } else {
      for (let r of this.userData?.roles) {
        this.roles.push(r?.name?.toLowerCase());
      }

      this.checkIfHostOrGuest();
    }
  }

  logout() {
    this.authService.logout();
    this.checkIfLogin();
    this.shared.sendIsLoginClickEvent();
  }

  getProfileDetails() {
    if (this.isLogin) {
      this.loading = true;
      this.httpService.getAuthSingle(baseUrl.profileDetails).subscribe(
        (data: any) => {
          this.userData = data?.data;

          for (let r of this.userData?.roles) {
            this.roles.push(r?.name?.toLowerCase());
          }

          this.checkIfHostOrGuest();

          this.service.setProfileMessage(data?.data);
          this.loading = false;
        },
        (err) => {
          this.authService.checkExpired();
          this.loading = false;
        }
      );
    }
  }

  checkIfHostOrGuest() {
    // if (this.roles?.includes('host')) {
    if (localStorage.getItem('CURRENT_USER_TYPE') === null) {
      this.switchGuest = true;
    } else {
      let switchGuest = localStorage.getItem('CURRENT_USER_TYPE') as any;
      if (switchGuest === 'true') {
        this.switchGuest = true;
      } else {
        this.switchGuest = false;
      }
    }
    // }
  }

  switch(type: boolean) {
    this.switchGuest = type;
    localStorage.setItem('CURRENT_USER_TYPE', type.toString());
    this.shared.sendIsLoginClickEvent();

    this.snackBar.open(
      `You have successfully switched to a ${
        type ? 'Guest' : 'Host'
      } user status`,
      'x',
      {
        duration: 3000,
        panelClass: 'success',
        horizontalPosition: 'center',
        verticalPosition: 'top',
      }
    );
  }

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
