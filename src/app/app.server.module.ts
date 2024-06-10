import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { provideClientHydration } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

@NgModule({
  imports: [AppModule, ServerModule],
  providers: [provideClientHydration()],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
