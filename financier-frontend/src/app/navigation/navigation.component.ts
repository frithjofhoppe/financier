import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../authentication/auth.service';
import {filter, map, tap} from 'rxjs/operators';
import {AuthenticationProcessService} from '../authentication/authentication-process.service';
import {MatIconRegistry, MatSidenav} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {User} from '../account-movement-overview/model';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  result: any;
  sideNavOpened = false;
  user: User;
  @ViewChild(MatSidenav, {static: false}) sideNav: MatSidenav;

  constructor(
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
    this.authProcess.getProfileIfLoggedIn().pipe(
      filter(profile => profile !== null),
      tap(profile => this.user = profile)
    ).subscribe();
  }

  toggle() {
    this.sideNav.toggle();
  }
}
