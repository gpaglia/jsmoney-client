/*
 * Angular 2 decorators and services
 */
import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  Input
} from '@angular/core';

import {
  AppStateService,
  AlertService,
  AlertMessage
} from './_app-services';

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
export class AppComponent implements OnInit, OnDestroy {
  @Input() public angularclassLogo = 'assets/img/angularclass-avatar.png';
  @Input() public name = 'Angular 2 Webpack Starter';
  @Input() public url = 'https://twitter.com/AngularClass';
  @Input() public userState: any = {};
  @Input() public dataset: any = {};
  @Input() public message: AlertMessage;

  private userStateSubscription: Subscription;
  private datasetStateSubscription: Subscription;
  private alertSubscription: Subscription;

  constructor(
    public appState: AppStateService,
    private alertService: AlertService,
    private authenticationService: AuthenticationService
  ) {}

  public ngOnInit() {
    console.log('Initial App State', this.appState.getAppState());
    this.userStateSubscription = this.appState
                  .getUserAsync()
                  .subscribe((user) => {
                    console.log('User state changed!!');
                    this.userState = {
                      loggedIn: user && user.id,
                      id: user ? user.id : undefined,
                      username: user ? user.username : 'anonymous',
                      role: user ? Role[user.role] : undefined
                    };
                  });
    this.datasetStateSubscription = this.appState
                  .getDatasetAsync()
                  .subscribe((ds) => {
                      this.dataset = {
                        id: ds.id,
                        name: ds.name
                      };
                  });
    this.alertSubscription =
          this.alertService.getMessage().subscribe((message) => {
            this.message = message;
          });
  }

  public ngOnDestroy() {
    this.userStateSubscription.unsubscribe();
    this.datasetStateSubscription.unsubscribe();
    this.alertSubscription.unsubscribe();
  }

  public clearMessage() {
    this.message = undefined;
  }

  public logout() {
    this.appState.clear();
  }
}
