import { Location } from '@angular/common';
import { Injectable } from '@angular/core';

import { AuthService } from '../global-services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class IsLoggedInGuard {
  constructor(private authService: AuthService, private _location: Location) {}

  canActivate() {
    return this.canLoad();
  }

  canLoad() {
    if (!this.authService.isLoggedIn()) {
      this._location.back();
    }
    return this.authService.isLoggedIn();
  }
}
