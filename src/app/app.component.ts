/*
 * Angular 2 decorators and services
 */
import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input
} from '@angular/core';

import { AppStateService } from './_app-services';
import { AuthenticationService } from './_backend-services';
import { IUserObject, Role } from 'jsmoney-server-api';
import { Subscription } from 'rxjs';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.css'
  ],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  @Input() public angularclassLogo = 'assets/img/angularclass-avatar.png';
  @Input() public name = 'Angular 2 Webpack Starter';
  @Input() public url = 'https://twitter.com/AngularClass';
  @Input() public userState: any = {};
  private subs: Subscription;

  constructor(
    public appState: AppStateService,
    private authenticationService: AuthenticationService
  ) {}

  public ngOnInit() {
    console.log('Initial App State', this.appState.getAppState());
    this.subs = this.appState
                  .getUserAsync()
                  .subscribe(user => {
                    console.log('User state changed!!');
                    this.userState = {
                      id: user ? user.id : undefined,
                      username: user ? user.username : 'anonymous',
                      role: user ? Role[user.role] : undefined
                    }
                  });
  }

   ngOnDestroy() {
    this.subs.unsubscribe();
  }

  public logout() {
    this.appState.clear();
  }
}

