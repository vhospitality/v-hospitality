import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  EventEmitter,
  Inject,
  Injectable,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, of } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { baseUrl } from '../../environments/environment';
import { ToggleNavService } from '../dashboard/dashboard-service/toggle-nav.service';
import { Tokens } from '../model/v-hospitality';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  @Output() public sidenavToggle2 = new EventEmitter();
  private readonly JWT_TOKEN = baseUrl.jwt_token;
  private readonly REFRESH_TOKEN = baseUrl.refresh_token;
  private helper = new JwtHelperService();
  private base_url = baseUrl.server;

  constructor(
    public shared: ToggleNavService,
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(user: any): Observable<boolean> {
    return this.http.post<any>(this.base_url + baseUrl.login, user).pipe(
      tap((tokens: any) => {
        this.storeTokens({ access: tokens?.data?.token });
        this.dialog.closeAll();
        this.shared.setProfileMessage(tokens?.data?.user);
        this.snackBar.open(
          tokens?.message ||
            tokens?.msg ||
            tokens?.detail ||
            'Login Successful',
          'x',
          {
            duration: 3000,
            panelClass: 'success',
            horizontalPosition: 'center',
            verticalPosition: 'top',
          }
        );
      }),
      mapTo(true),
      catchError((error: any) => {
        this.snackBar.open(
          error?.error?.detail ||
            error?.error?.message ||
            'An error occured, please try again',
          'x',
          {
            duration: 5000,
            panelClass: 'error',
            horizontalPosition: 'center',
            verticalPosition: 'top',
          }
        );
        return of(false);
      })
    );
  }

  isLoggedIn() {
    return !!this.getJwtToken();
  }

  checkExpired() {
    if (isPlatformBrowser(this.platformId)) {
      const isExpired = this.helper.isTokenExpired(this.getJwtToken());
      if (isExpired) {
        this.shared.sendIsLoginClickEvent();
        this.logout();
      }
    }
  }

  refreshToken() {
    const data = {
      refresh: this.getRefreshToken(),
    };
    return this.http.post<any>(this.base_url + baseUrl.refresh, data).subscribe(
      (tokens: any) => {
        this.storeJwtToken(tokens.access);
        return true;
      },
      () => {
        return false;
      }
    );
  }

  getJwtToken(): any {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.JWT_TOKEN);
    } else {
      return false;
    }
  }

  public logout() {
    if (isPlatformBrowser(this.platformId)) {
      this.removeTokens();
      this.shared.setProfileMessage(undefined);
      this.shared.setSubscriptionsMessage(undefined);
      this.shared.setPayoutMessage(undefined);
      this.shared.setCardsMessage(undefined);
      this.shared.setAccommodationMessage(undefined);
      this.shared.setPropertyMessage(undefined);
      this.shared.setWishlistMessage(undefined);
      this.shared.setDraftMessage(undefined);
      this.shared.setNotificationMessage(undefined);
      this.shared.profileMessage = undefined;
      this.shared.subscriptions = undefined;
      this.shared.payoutMessage = undefined;
      this.shared.cards = undefined;
      this.shared.accommodationMessage = undefined;
      this.shared.propertyMessage = undefined;
      this.shared.wishlist = undefined;
      this.shared.draft = undefined;
      this.shared.notificationMessage = undefined;
      localStorage.removeItem(baseUrl.wishlist_storage);
      localStorage.removeItem(baseUrl.localStorageSelectedBooking);
      localStorage.removeItem(baseUrl.localStorageSelectedChat);
      localStorage.removeItem(baseUrl.rooms);
      localStorage.removeItem('V_HOSPITALITY_DEVICE_TOKEN');
      this.router.navigate(['/home'], {
        queryParams: { returnUrl: this.router.url },
      });
    }
  }

  getRefreshToken(): any {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.REFRESH_TOKEN);
    }
  }

  private storeJwtToken(jwt: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.JWT_TOKEN, jwt);
    }
  }

  public storeTokens(tokens: Tokens) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.JWT_TOKEN, tokens.access);
    }
  }

  private removeTokens() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.JWT_TOKEN);
      localStorage.removeItem(this.REFRESH_TOKEN);
    }
  }
}
