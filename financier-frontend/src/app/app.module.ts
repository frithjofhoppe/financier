import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {
  MAT_DATE_FORMATS,
  MatButtonModule,
  MatCardModule, MatDatepickerModule, MatDividerModule, MatFormFieldModule,
  MatIconModule, MatInputModule,
  MatListModule,
  MatMenuModule, MatNativeDateModule, MatProgressBarModule,
  MatSidenavModule,
  MatToolbarModule
} from '@angular/material';
import {CallbackComponent} from './authentication/callback/callback.component';
import {LogoutComponent} from './authentication/logout/logout.component';
import {NavigationComponent} from './navigation/navigation.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {JWT_OPTIONS, JwtHelperService, JwtInterceptor, JwtModule} from '@auth0/angular-jwt';
import {CookieService} from 'ngx-cookie-service';
import {AuthenticationProcessService} from './authentication/authentication-process.service';
import {tap} from 'rxjs/operators';
import {JwtInterceptorService} from './authentication/jwt-interceptor.service';
import {HomeComponent} from './home/home.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ContainerComponent} from './common/container/container.component';
import {AccountMovementOverviewComponent} from './account-movement-overview/account-movement-overview.component';
import {AccountMovementEditComponent} from './account-movement-overview/account-movement-edit/account-movement-edit.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ProgressBarComponent} from './common/progress-bar/progress-bar.component';
import {MatMomentDateModule, MomentDateModule} from '@angular/material-moment-adapter';


export function jwtOptionsFactory(tokenService: AuthenticationProcessService) {
  return {
    tokenGetter: () => {
      console.log('test');
      return tokenService.jwt.pipe(
        tap(j => console.log(j))
      );
    }
  };
}

@NgModule({
  declarations: [
    AppComponent,
    CallbackComponent,
    LogoutComponent,
    NavigationComponent,
    HomeComponent,
    ContainerComponent,
    AccountMovementOverviewComponent,
    AccountMovementEditComponent,
    ProgressBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    HttpClientModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [AuthenticationProcessService]
      }
    }),
    MatSidenavModule,
    MatMenuModule,
    MatListModule,
    MatCardModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatMomentDateModule,
    MomentDateModule,
    MatProgressBarModule,
    FormsModule,
    MatDividerModule
  ],
  providers: [
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
