import {Component} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from './authentication/auth.service';
import {mergeMap, tap} from 'rxjs/operators';
import {AuthenticationProcessService} from './authentication/authentication-process.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'financier-frontend';

  constructor(private http: HttpClient, private auth: AuthService, private process: AuthenticationProcessService) {
  }

  getAccountMovement() {
    this.http.get('http://localhost:8080/api/accountmovement').subscribe(res => console.log(res));
  }

  sendAccountMovement() {
    const m: AccountMovement = {
      id: '2',
      value: 110,
      valuata: '2019-29-07',
      movementDirection: 'DEBIT'
    };

    this.auth.auth0Client$.pipe(
      tap(profile => console.log(profile.getTokenSilently()))
    ).subscribe();

    this.auth.auth0Client$.pipe(
      mergeMap(profile => this.http.post<AccountMovement>('http://localhost:8080/api/accountmovement', m, {
          withCredentials: true,
          headers: new HttpHeaders({
            Authorization: `Bearer ${profile.getTokenSilently()}`
          })
        })
      )
    ).subscribe();
  }
}

export interface AccountMovement {
  id: string;
  value: number;
  valuata: string;
  movementDirection: string;
}
