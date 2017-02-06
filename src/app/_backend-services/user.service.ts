import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BackendServiceHelper, BodyParser } from './backend.service.helper';
import { ConfigService, AppStateService } from '../_app-services';

import { IUserObject, IBody, makeBody } from 'jsmoney-server-api';


@Injectable()
export class UserService {
    constructor(
        private appState: AppStateService,
        private config: ConfigService,
        private backend: BackendServiceHelper
    ) { }

    public getUsers(): Observable<IUserObject[]> {
      return this.backend.get(['users'], null, true);
    }

    public getUserById(id: string): Observable<IUserObject> {
        return this.backend.get(['users', ':id'], {'id': id}, null, null, true);
    }

    public createUser(user: IUserObject): Observable<IUserObject> {
        return this.backend.postEmbed(['users'], makeBody(user), null, true);
    }
/*

    public deleteUser(id: string): Observable<void>;

*/


}
