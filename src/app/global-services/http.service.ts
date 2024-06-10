import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, shareReplay } from 'rxjs';
import { baseUrl } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private base_url = baseUrl.server;

  constructor(private http: HttpClient, private authService: AuthService) {}

  httpOptions() {
    return {
      headers: {
        Authorization: `Bearer ${this.authService.getJwtToken()}`,
      },
    };
  }

  getSingleNoAuth(endpoint: any) {
    return this.http.get(this.base_url + endpoint).pipe(shareReplay());
  }

  async searchLocation(query: string) {
    const resp = await fetch(baseUrl.searchLocation + query);
    const data = await resp.json();
    const {
      results: [results],
    } = data;
    return results;
  }

  getMapData() {
    return this.http
      .jsonp(
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyCE4z4wdxDikBjqjTsMPEK0p6Dd5faoqbg',
        'callback'
      )
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );
  }

  getLags() {
    return this.http.get<any>('assets/json-files/lga.json');
  }

  getSingleNoAuthID(endpoint: any, id: any) {
    return this.http.get(this.base_url + endpoint + id).pipe(shareReplay());
  }

  getAuthSingle(endpoint: any): Observable<any[]> {
    return this.http
      .get<any[]>(this.base_url + endpoint, this.httpOptions())
      .pipe(shareReplay());
  }

  getAuthSingleID(endpoint: any, id: any): Observable<any[]> {
    return this.http
      .get<any[]>(this.base_url + endpoint + id, this.httpOptions())
      .pipe(shareReplay());
  }

  postData(endpoint: any, data: any): Observable<any[]> {
    return this.http.post<any[]>(
      this.base_url + endpoint,
      data,
      this.httpOptions()
    );
  }

  registerForChat(endpoint: any, data: any): Observable<any[]> {
    return this.http.post<any[]>(endpoint, data);
  }

  updateDeviceTokenForChat(endpoint: any, data: any): Observable<any[]> {
    return this.http.patch<any[]>(endpoint, data);
  }

  getForChat(endpoint: any): Observable<any[]> {
    return this.http.get<any>(endpoint);
  }

  postImage(endpoint: any, data: any): Observable<number | any> {
    let headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.getJwtToken()}`
    );

    return this.http
      .post(this.base_url + endpoint, data, {
        headers,
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        // Track progress
        map((event: HttpEvent<any>) => {
          return this.trackEvent(event);
        })
      );
  }

  getProgress(endpoint: string): Observable<number | any> {
    let headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.getJwtToken()}`
    );

    return this.http
      .request('get', this.base_url + endpoint, {
        headers: headers,
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        // Track progress
        map((event: HttpEvent<any>): any => {
          return this.trackEvent(event);
        })
      );
  }

  updateData(endpoint: any, data: any): Observable<any[]> {
    return this.http.patch<any[]>(
      this.base_url + endpoint,
      data,
      this.httpOptions()
    );
  }

  updatePutData(endpoint: any, data: any): Observable<any[]> {
    return this.http.put<any[]>(
      this.base_url + endpoint,
      data,
      this.httpOptions()
    );
  }

  deleteData(endpoint: any, id: any): Observable<any[]> {
    return this.http.delete<any[]>(
      this.base_url + endpoint + id,
      this.httpOptions()
    );
  }

  trackEvent(event: HttpEvent<any>) {
    if (
      event.type === HttpEventType.UploadProgress ||
      event.type === HttpEventType.DownloadProgress
    ) {
      const percentDone = Math.round((event.loaded / event.total!) * 100);
      return percentDone;
    } else if (event.type === HttpEventType.Response) {
      return event.body;
    }
  }
}
