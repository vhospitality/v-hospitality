import { AsyncPipe, DatePipe, provideImageKitLoader } from '@angular/common';
import {
  HttpClientModule,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';
import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
  isDevMode,
} from '@angular/core';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  BrowserModule,
  provideClientHydration,
  withHttpTransferCacheOptions,
} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { initializeApp } from 'firebase/app';
import { baseUrl } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './global-services/auth.service';
import { ChatService } from './global-services/chat.service';
import { HttpService } from './global-services/http.service';
import { NetworkAwarePreloadingStrategyService2Service } from './global-services/network-aware-preloading-strategy.service';
import { SeoService } from './global-services/seo.service';

initializeApp(baseUrl.firebase);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatBottomSheetModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatSnackBarModule,
    HttpClientModule,
    LoadingBarHttpClientModule,
    LoadingBarModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    FontAwesomeModule,
  ],
  providers: [
    HttpService,
    AuthService,
    ChatService,
    MatDatepickerModule,
    MatNativeDateModule,
    NetworkAwarePreloadingStrategyService2Service,
    SeoService,
    DatePipe,
    AsyncPipe,
    provideImageKitLoader(baseUrl.lazyLoadUrl),
    SeoService,
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    provideClientHydration(
      withHttpTransferCacheOptions({
        includePostRequests: true,
      })
    ),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  public static forRoot(): ModuleWithProviders<AppModule> {
    return {
      ngModule: AppModule,
      providers: [],
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: AppModule) {
    if (parentModule) {
      throw new Error(
        'StateModule is already loaded. Import it in the AppModule only'
      );
    }
  }
}
