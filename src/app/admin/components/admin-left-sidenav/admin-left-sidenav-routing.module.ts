import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLeftSidenavComponent } from './admin-left-sidenav.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLeftSidenavComponent,
    children: [
      { path: '', redirectTo: '', pathMatch: 'full' },
      // {
      //   path: 'overview',
      //   loadComponent: () =>
      //     import('../../pages/dashboard/dashboard.component').then(
      //       (m) => m.DashboardComponent
      //     ),
      //   // canLoad: [IsLoggedInGuard],
      // },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
