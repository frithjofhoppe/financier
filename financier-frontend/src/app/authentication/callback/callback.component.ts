import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {AuthenticationProcessService} from '../authentication-process.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {

  constructor(private authProcess: AuthenticationProcessService) {
  }

  ngOnInit(): void {
    this.authProcess.handleCallback();
  }
}
