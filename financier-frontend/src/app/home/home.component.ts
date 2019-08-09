import {Component, OnInit} from '@angular/core';
import {CurrentUserService} from '../service/current-user.service';
import {User} from '../account-movement-overview/model';
import {AuthenticationProcessService} from '../authentication/authentication-process.service';
import {mergeMap, tap} from 'rxjs/operators';
import {log} from 'util';
import {of} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  profile: User;

  constructor(private currentUser: CurrentUserService, private auth: AuthenticationProcessService) {
  }

  ngOnInit() {
  }
}
