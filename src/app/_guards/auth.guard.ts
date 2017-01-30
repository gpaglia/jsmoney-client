import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserStateService } from '../_services/user.state.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
      private router: Router,
      private userStateService: UserStateService)
    { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      let url: string = state.url;
      if (this.userStateService.isLoggedIn()) {
          // logged in so return true
          return true;
      }

      // not logged in so redirect to login page with the return url
      this.router.navigate(['/login', { returnUrl: state.url }]);
      return false;
  }
}
