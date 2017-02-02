import { Injectable, Injector } from '@angular/core';
import { Headers, Response } from '@angular/http';
import { BackendHttp } from './backend.http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

import { handleError } from '../_helpers/error-catcher';

import { AppStateService } from './app.state.service';
import { ConfigService } from './config.service';
import { ICredentialsObject, IUserObject } from 'jsmoney-server-api';

@Injectable()
export class AuthenticationService {
    constructor(
      private appState: AppStateService,
      private config: ConfigService,
      private http: BackendHttp
    ) { }


    login(credentials: ICredentialsObject): Observable<IUserObject> {
      console.log('Authentication service, login with credentials ' + JSON.stringify(credentials, null, 4));
        return this.http.post(this.config.api('/authenticate'), JSON.stringify(credentials))
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let body = response.json();
                if (body.data && body.data.user && body.data.token) {
                  let user: IUserObject = body.data.user;
                  let token: string = body.data.token;
                  // store user details and jwt token in local storage to keep user logged in between page refreshes
                  this.appState.setUser(user, token);
                  return Observable.of(user);
                } else {
                  throw('Got invalid response from server ' + JSON.stringify(body));
                }
            })
            .catch(handleError);
    }

    logout() {
      // remove user from local storage to log user out
      this.appState.clear();
    }
}
