import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';

import { LoginComponent } from './modules/login/login.component';
const routes: Routes = [
  { path: '', redirectTo: 'Dashboard', pathMatch: 'full' },
  { path: 'Login', component: LoginComponent },
  { path: 'Dashboard', canLoad: [AuthGuard], loadChildren: './modules/dashboard/dashboard.module#DashboardModule' }
  // canLoad: [AuthGuard],
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})

export class AppRoutingModule { }