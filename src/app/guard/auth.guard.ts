import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {map, Observable} from 'rxjs';
import {AuthService} from "../domains/auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isAuthorized(route).pipe(
      map((isAuthorized: boolean) => {
        if (!isAuthorized) {
          return this.router.createUrlTree(['/unauthorized']);
        }
        return isAuthorized;
      })
    );
  }

  private isAuthorized(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.authService.getRoles().pipe(
      map((roles: string[]) => {
        const expectedRoles = route.data["expectedRoles"];
        return roles.some(role => expectedRoles.includes(role));
      })
    );
  }

}
