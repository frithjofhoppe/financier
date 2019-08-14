import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Tag} from '../account-movement-overview/model';
import {Observable} from 'rxjs';
import {API} from './api-const';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(private http: HttpClient) {
  }

  getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${API.url}tag`);
  }
}
