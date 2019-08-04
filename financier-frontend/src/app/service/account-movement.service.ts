import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {API} from './api-const';
import {AccountMovement} from '../account-movement-overview/model';

@Injectable({
  providedIn: 'root'
})
export class AccountMovementService {

  constructor(private http: HttpClient) {
  }

  getAccountMovementsForUser(): Observable<AccountMovement[]> {
    return this.http.get<AccountMovement[]>(`${API.url}accountmovement`);
  }
}
