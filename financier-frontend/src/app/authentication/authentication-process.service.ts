import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
// @ts-ignore
import * as nanoid from 'nanoid';
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt';
import {NoAuthorizationParamsFoundError} from './model/no-authorization-params-found-error';
import {removeWhitespaces} from '@angular/compiler/src/ml_parser/html_whitespaces';
import {BasicTokenValidationError} from './model/basic-token-validation-error';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';
import {User} from '../account-movement-overview/model';
import {mergeMap, tap} from 'rxjs/operators';
import {CurrentUserService} from '../service/current-user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationProcessService {

  private readonly authUri = 'https://frithjofhoppe.auth0.com/authorize';
  private readonly clientId = 'a5VZ2jUfcH150vqpBpxrXjB2XePKtDw4';
  private readonly audience = 'http://frithjofhome.synology.me';
  private readonly scope = 'openid profile email';
  private readonly redirectUri = 'http://localhost:4200/callback';
  private readonly responseType = 'id_token token';
  private readonly cookieStateKey = `${this.audience}_state`;
  private readonly cookieNonceKey = `${this.audience}_nonce`;
  private readonly cookieAccessTokenKey = `${this.audience}_accessToken`;
  private readonly cookieIdTokenKey = `${this.audience}_idToken`;
  private readonly cookieKeys = [
    this.cookieStateKey,
    this.cookieNonceKey,
    this.cookieAccessTokenKey,
    this.cookieIdTokenKey
  ];

  isUserLoggedIn: Observable<boolean>;
  userProfile: Observable<JwtUserProfile>;
  jwt: Observable<string>;

  private isUserLoggedInSubject = new BehaviorSubject<boolean>(false);
  private userProfileSubject = new BehaviorSubject<JwtUserProfile>(null);
  private jwtSubject = new BehaviorSubject<string>(null);

  constructor(
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private jwtHelper: JwtHelperService,
    private currentUser: CurrentUserService,
    private cookieService: CookieService) {
    this.isUserLoggedIn = this.isUserLoggedInSubject.asObservable();
    this.userProfile = this.userProfileSubject.asObservable();
    this.jwt = this.jwtSubject.asObservable();
  }

  private generateState(): void {
    const state = nanoid(9);
    this.cookieService.set(this.cookieStateKey, state);
  }

  private getState(): string {
    const state = this.getCookie(this.cookieStateKey);
    if (!state) {
      this.generateState();
    }
    return this.getCookie(this.cookieStateKey);
  }

  private generateNonce(): void {
    const nonce = nanoid(16);
    this.cookieService.set(this.cookieNonceKey, nonce);
  }

  private getNonce(): string {
    const nonce = this.getCookie(this.cookieNonceKey);
    if (!nonce) {
      this.generateNonce();
    }
    return this.getCookie(this.cookieNonceKey);
  }

  private getCookie(key: string) {
    return this.cookieService.get(key);
  }

  public redirectToLogin() {
    window.location.href = this.authUri +
      '?response_type=' + this.responseType +
      '&client_id=' + this.clientId +
      '&redirect_uri=' + this.redirectUri +
      '&scope=' + this.scope +
      '&audience=' + this.audience +
      '&state=' + this.getState() +
      '&nonce=' + this.getNonce();
  }

  public redirectToLogout() {
    this.updateStateForLogout();
    window.location.href = 'https://frithjofhoppe.auth0.com/v2/logout?' +
      'client_id=' + this.clientId +
      '&returnTo=http://localhost:4200/logout';
  }

  public getProfileIfLoggedIn(): Observable<User> {
    return this.isUserLoggedIn.pipe(
      mergeMap(loggedIn => {
        if (loggedIn) {
          return this.currentUser.getUserProfile().pipe(
          );
        }
        return of(null);
      })
    );
  }

  public handleCallback() {
    try {
      this.persistCallbackResponse();
      this.updateStateForLogin();
    } catch (e) {
      this.updateStateForLogout();
      throw e;
    }
    this.router.navigate(['/home']);
  }

  private updateStateForLogin() {
    try {
      const profile = this.getProfile();
      this.userProfileSubject.next(profile);
      this.isUserLoggedInSubject.next(true);
      this.jwtSubject.next(this.getCookie(this.cookieIdTokenKey));
    } catch (e) {
      throw e;
    }
  }

  private updateStateForLogout() {
    this.isUserLoggedInSubject.next(false);
    this.userProfileSubject.next(null);
    this.jwtSubject.next(null);
    this.cookieKeys.forEach(key => this.cookieService.delete(key));
  }

  private validateToken(requestState: string) {
    const profile = this.getProfile();
    const storeState = this.getCookie(this.cookieStateKey);
    const storeNonce = this.getCookie(this.cookieNonceKey);

    if (profile.nonce !== storeNonce) {
      throw new BasicTokenValidationError('Nonce from idToken not match with expected value');
    }

    if (requestState !== storeState) {
      throw new BasicTokenValidationError('State from request not match with expected value');
    }
    this.validateTokenExpirationTime(profile);
  }

  private validateTokenExpirationTime(profile: JwtUserProfile) {
    console.log(new Date());
    console.log(new Date(Number(profile.exp) * 1000));
    if (new Date() >= new Date(Number(profile.exp) * 1000)) {
      throw new BasicTokenValidationError('Token has expired');
    }
  }

  private persistCallbackResponse() {
    const queryParams = this.getQueryParams();
    const response: LoginRedirectResponse = {
      accessToken: queryParams.access_token,
      idToken: queryParams.id_token,
      state: queryParams.state
    };
    if (!response.accessToken || !response.idToken || !response.state) {
      throw new NoAuthorizationParamsFoundError('AccessToken, IdToken or State weren\'t transmitted with callback request');
    }
    this.cookieService.set(this.cookieAccessTokenKey, response.accessToken);
    this.cookieService.set(this.cookieIdTokenKey, response.idToken);
    this.validateToken(response.state);
  }

  private getQueryParams(): { [param: string]: string } {
    const fragment = this.route.snapshot.fragment;
    const rawParams: string[] = fragment.split('&');
    const params = {};
    rawParams.forEach(param => {
      const pair = param.split('=');
      params[pair[0]] = pair[1] as string;
    });
    return params;
  }

  private getProfile(): JwtUserProfile {
    const rawProfile = this.jwtHelper.decodeToken(this.getCookie(this.cookieIdTokenKey));

    if (!rawProfile) {
      throw new Error('Profile is empty');
    }

    const profile = rawProfile as JwtUserProfile;
    profile.permissions = rawProfile[`${this.audience}permissions`];
    profile.roles = rawProfile[`${this.audience}roles`];
    profile.groups = rawProfile[`${this.audience}groups`];
    return profile;
  }

  public autoLogin(): void {
    try {
      const idToken = this.getCookie(this.cookieIdTokenKey);
      if (idToken) {
        this.validateTokenExpirationTime(this.getProfile());
        this.updateStateForLogin();
      }
    } catch (e) {
    }
  }
}

interface JwtUserProfile {
  name: string;
  picture: string;
  email: string;
  iss: string;
  sub: string;
  aud: string;
  iat: string;
  exp: string;
  nonce: string;
  at_hash: string;
  permissions: string[];
  roles: string[];
  groups: string[];
}

interface LoginRedirectResponse {
  idToken: string;
  accessToken: string;
  state: string;
}
