import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {MatButtonModule, MatIconModule, MatToolbarModule} from '@angular/material';
import {CallbackComponent} from './authentication/callback/callback.component';
import {LogoutComponent} from './authentication/logout/logout.component';
import {NavigationComponent} from './navigation/navigation.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {JWT_OPTIONS, JwtHelperService, JwtInterceptor, JwtModule} from '@auth0/angular-jwt';
import {CookieService} from 'ngx-cookie-service';
import {AuthenticationProcessService} from './authentication/authentication-process.service';
import {tap} from 'rxjs/operators';
import {JwtInterceptorService} from './authentication/jwt-interceptor.service';


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
    NavigationComponent
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
    })
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
