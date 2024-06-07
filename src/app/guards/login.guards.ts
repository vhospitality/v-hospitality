import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../global-services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private _location: Location
  ) {}

  canActivate() {
    if (this.authService.isLoggedIn()) {
      this._location.back();
    }
    return !this.authService.isLoggedIn();
  }
}
