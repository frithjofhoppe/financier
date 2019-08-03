import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {from, Observable, of} from 'rxjs';
import {AuthenticationProcessService} from './authentication-process.service';
import {mergeMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IsAuthenticatedGuard implements CanActivate {

  constructor(private auth: AuthenticationProcessService, private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.auth.isUserLoggedIn.pipe(
      mergeMap(isLoggedIn => {
        if (!isLoggedIn) {
          return from(this.router.navigate(['/']));
        }
        return of(isLoggedIn);
      })
    );
  }
}
