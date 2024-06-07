import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';

export declare let navigator: { connection: any };

@Injectable({
  providedIn: 'root',
})
export class NetworkAwarePreloadingStrategyService2Service
  implements PreloadingStrategy
{
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    return this.hasGoodConnection() ? load() : EMPTY;
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  hasGoodConnection(): boolean {
    let conn: any = '';
    if (isPlatformBrowser(this.platformId)) {
      conn = navigator.connection;
    }
    if (conn) {
      if (conn.saveData) {
        return false; // save data mode is enabled, so dont preload
      }
      const avoidTheseConnections = ['slow-2g', '2g' /*'4g' */];
      const effectiveType = conn.effectiveType || '';

      if (avoidTheseConnections.includes(effectiveType)) {
        return false;
      }
    }
    return true;
  }
}
