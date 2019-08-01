import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
// @ts-ignore
import * as nanoid from 'nanoid';
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt';
import {NoAuthorizationParamsFoundError} from './model/no-authorization-params-found-error';
import {removeWhitespaces} from '@angular/compiler/src/ml_parser/html_whitespaces';
import {BasicTokenValidationError} from './model/basic-token-validation-error';

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
  private readonly localStoreStateKey = `${this.audience}_state`;
  private readonly localStoreNonceKey = `${this.audience}_nonce`;
  private readonly localStoreAccessTokenKey = `${this.audience}_accessToken`;
  private readonly localStoreIdTokenKey = `${this.audience}_idToken`;

  constructor(private http: HttpClient, private route: ActivatedRoute, private jwtHelper: JwtHelperService) {
  }

  private generateState(): void {
    const state = nanoid(9);
    localStorage.setItem(this.localStoreStateKey, state);
  }

  private getState(): string {
    const state = this.getLocalStorageItem(this.localStoreStateKey);
    if (!state) {
      this.generateState();
    }
    return this.getLocalStorageItem(this.localStoreStateKey);
  }

  private generateNonce(): void {
    const nonce = nanoid(16);
    localStorage.setItem(this.localStoreNonceKey, nonce);
  }

  private getNonce(): string {
    const nonce = this.getLocalStorageItem(this.localStoreNonceKey);
    if (!nonce) {
      this.generateNonce();
    }
    return this.getLocalStorageItem(this.localStoreNonceKey);
  }

  private getLocalStorageItem(key: string) {
    return localStorage.getItem(key);
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

  public handleCallback() {
    this.persistCallbackResponse();
  }

  private validateToken(requestState: string) {
    const profile = this.getProfile();
    const storeState = this.getLocalStorageItem(this.localStoreStateKey);
    const storeNonce = this.getLocalStorageItem(this.localStoreNonceKey);

    if (profile.nonce !== storeNonce) {
      throw new BasicTokenValidationError('Nonce from idToken not match with expected value');
    }

    if (requestState !== storeState) {
      throw new BasicTokenValidationError('State from request not match with expected value');
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
    localStorage.setItem(this.localStoreAccessTokenKey, response.accessToken);
    localStorage.setItem(this.localStoreIdTokenKey, response.idToken);
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
    const rawProfile = this.jwtHelper.decodeToken(this.getLocalStorageItem(this.localStoreIdTokenKey));
    const profile = rawProfile as JwtUserProfile;
    profile.permissions = rawProfile[`${this.audience}permissions`];
    profile.roles = rawProfile[`${this.audience}roles`];
    profile.groups = rawProfile[`${this.audience}groups`];
    return profile;
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
