import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthenticationProcessService} from './authentication-process.service';
import {filter, map, mergeMap, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor {

  constructor(private authProcessService: AuthenticationProcessService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('interceptor');
    return this.authProcessService.jwt.pipe(
      mergeMap(jwt => {
        console.log(jwt);
        let request = req;
        if (jwt) {
          request = req.clone({
            setHeaders: {
              Authorization: `Bearer ${jwt}`
            }
          });
        }
        return next.handle(request);
      })
    );
  }
}
