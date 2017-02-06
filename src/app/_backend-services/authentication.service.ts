import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BackendServiceHelper, BodyParser } from './backend.service.helper';
import { ConfigService, AppStateService } from '../_app-services';
import { ICredentialsObject, IAuthenticateData, IUserObject, IBody, makeBody } from 'jsmoney-server-api';


@Injectable()
export class AuthenticationService {
    constructor(
      private appState: AppStateService,
      private config: ConfigService,
      private backend: BackendServiceHelper
    ) { }

    public login(credentials: ICredentialsObject): Observable<IAuthenticateData> {
      return this.backend.post(['authenticate'], credentials, null, false);
    }

    public logout() {
      // empty for now
    }

}
