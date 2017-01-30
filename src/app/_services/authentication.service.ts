import { Injectable, Injector } from '@angular/core';
import { Headers, Response } from '@angular/http';
import { BackendHttp } from './backend.http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

import { handleError } from '../_helpers/error-catcher';

import { UserStateService } from './user.state.service';
import { ConfigService } from './config.service';
import { ICredentialsObject, IUserObject } from 'jsmoney-server-api';

@Injectable()
export class AuthenticationService {
    constructor(
      private userStateService: UserStateService,
      private config: ConfigService,
      private http: BackendHttp
    ) { }


    login(credentials: ICredentialsObject): Observable<IUserObject> {
        return this.http.post(this.config.api('/authenticate'), JSON.stringify(credentials))
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let body = response.json();
                if (body.data && body.data.user && body.data.token) {
                  let user: IUserObject = body.data.user;
                  let token: string = body.data.token;
                  // store user details and jwt token in local storage to keep user logged in between page refreshes
                  this.userStateService.setState(user, token);
                  return Observable.of(user);
                } else {
                  throw('Got invalid response from server ' + JSON.stringify(body));
                }
            })
            .catch(handleError);
    }

    logout() {
      // remove user from local storage to log user out
      this.userStateService.clear();
    }
}
