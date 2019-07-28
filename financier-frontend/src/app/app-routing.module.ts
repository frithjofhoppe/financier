import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CallbackComponent} from './authentication/callback/callback.component';
import {LogoutComponent} from './authentication/logout/logout.component';

const routes: Routes = [
  {path: 'callback', component: CallbackComponent},
  {path: 'logout', component: LogoutComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
