/*
 * Angular 2 decorators and services
 */
import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import { AppStateService, UserStateService, AuthenticationService } from './_services';
import { IUserObject, Role } from 'jsmoney-server-api';

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
  public angularclassLogo = 'assets/img/angularclass-avatar.png';
  public name = 'Angular 2 Webpack Starter';
  public url = 'https://twitter.com/AngularClass';
  userState: any = {};

  constructor(
    public appState: AppStateService,
    private userStateService: UserStateService,
    private authenticationService: AuthenticationService
  ) {}

  public ngOnInit() {
    console.log('Initial App State', this.appState.state);
    this.userState = this.userStateService
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

}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
