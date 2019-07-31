import {Component, OnInit} from '@angular/core';
import {AuthService} from '../authentication/auth.service';
import {from} from 'rxjs';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  isAuthenticated = false;
  profile: any;
  private authClient: Auth0Client;

  constructor(private auth: AuthService) {
  }

  async ngOnInit() {
    // Get an instance of the Auth0 client
    this.authClient = await this.auth.getAuth0Client();

    // Watch for changes to the isAuthenticated state
    this.auth.isAuthenticated.subscribe(value => {
      this.isAuthenticated = value;
    });

    // Watch for changes to the profile data
    this.auth.profile.subscribe(profile => {
      this.profile = profile;
    });
  }

  async login() {
    await this.authClient.loginWithRedirect({});
  }

  logout() {
    this.authClient.logout({
      client_id: this.auth.config.client_id,
      returnTo: 'http://localhost:4200/logout'
    });
  }
}
