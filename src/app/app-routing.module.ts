import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NetworkAwarePreloadingStrategyService2Service } from './global-services/network-aware-preloading-strategy.service';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import(
        './dashboard/components/app-public-sidenav/app-public-sidenav.module'
      ).then((m) => m.AppPublicSidenavModule),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import(
        './admin/components/admin-left-sidenav/admin-left-sidenav.module'
      ).then((m) => m.AdminLeftSidenavModule),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: NetworkAwarePreloadingStrategyService2Service,
      scrollPositionRestoration: 'enabled',
      initialNavigation: 'enabledBlocking',
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
