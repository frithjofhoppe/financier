import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../authentication/auth.service';
import {map} from 'rxjs/operators';
import {AuthenticationProcessService} from '../authentication/authentication-process.service';
import {MatIconRegistry, MatSidenav} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  result: any;
  sideNavOpened = false;
  @ViewChild(MatSidenav, {static: false}) sideNav: MatSidenav;

  constructor(
    private auth: AuthService,
    private authProcess: AuthenticationProcessService,
    private matIcon: MatIconRegistry,
    private domSanitizer: DomSanitizer) {
    this.matIcon.addSvgIcon(
      'financier',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/big-moustache.svg')
    );
    this.matIcon.addSvgIcon(
      'finacier-2',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/moustache.svg')
    );
  }

  ngOnInit(): void {
    this.auth.localAuthSetup();
  }

  fetchToken() {
    this.token().subscribe(res => this.result = res);
  }

  toogle() {
    this.sideNav.toggle();
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
