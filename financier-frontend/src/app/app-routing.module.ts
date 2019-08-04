import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CallbackComponent} from './authentication/callback/callback.component';
import {LogoutComponent} from './authentication/logout/logout.component';
import {HomeComponent} from './home/home.component';
import {AccountMovementOverviewComponent} from './account-movement-overview/account-movement-overview.component';
import {IsAuthenticatedGuard} from './authentication/is-authenticated.guard';

const routes: Routes = [
  {path: 'callback', component: CallbackComponent},
  {path: 'logout', component: LogoutComponent},
  {path: 'home', component: HomeComponent},
  {path: 'movement', component: AccountMovementOverviewComponent, canActivate: [IsAuthenticatedGuard]},
  {path: '', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
