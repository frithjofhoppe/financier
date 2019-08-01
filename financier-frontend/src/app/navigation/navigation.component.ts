import {Component, OnInit} from '@angular/core';
import {AuthService} from '../authentication/auth.service';
import {from} from 'rxjs';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import {map} from 'rxjs/operators';
import {AuthenticationProcessService} from '../authentication/authentication-process.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  result: any;

  constructor(private auth: AuthService, private authProcess: AuthenticationProcessService) {
  }

  ngOnInit(): void {
    this.auth.localAuthSetup();
  }

  fetchToken() {
    this.token().subscribe(res => this.result = res);
  }



  token() {
    return this.auth.auth0Client$.pipe(
      map(t => t.getTokenSilently({
        audience: 'a5VZ2jUfcH150vqpBpxrXjB2XePKtDw4',
        redirect_uri: 'http://localhost:4200/callback',
        scope: 'openid profile email'
      }))
    );
  }
}
