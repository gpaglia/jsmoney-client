import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AppStateService } from '../_app-services';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
      private router: Router,
      private appState: AppStateService)
    { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      let url: string = state.url;
      if (this.appState.isLoggedIn()) {
          // logged in so return true
          return true;
      }

      // not logged in so redirect to login page with the return url
      this.router.navigate(['/login', { returnUrl: state.url }]);
      return false;
  }
}
