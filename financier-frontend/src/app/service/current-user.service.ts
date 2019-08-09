import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../account-movement-overview/model';
import {Observable} from 'rxjs';
import {API} from './api-const';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  constructor(private http: HttpClient) {
  }

  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${API.url}user`);
  }
}
