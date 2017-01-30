import { Injectable, Injector } from '@angular/core';
import { Headers, RequestOptions, Response } from '@angular/http';
import { BackendHttp } from './backend.http';
import { ConfigService } from './config.service';
import { UserStateService } from './user.state.service';

import { Observable } from 'rxjs/Observable';

import { handleError } from '../_helpers/error-catcher';
import { IUserObject } from 'jsmoney-server-api';

@Injectable()
export class UserService {
    constructor(
      private http: BackendHttp,
      private config: ConfigService,
      private us: UserStateService
    ) { }

    getAll(): Observable<IUserObject[]> {
      return this.http.get(this.config.api('/users'), this.us.authHeaders())
        .map((response: Response) => {
          let body = response.json().body;
          if (body.data && body.data.users) {
            return <IUserObject[]>response.json().body.data.users;
          } else {
            return Observable.throw('Invalid data received from service (get /users)');
          }
      })
      .catch(handleError);
    }

    getById(id: number): Observable<IUserObject> {
      return this.http.get(this.config.api('/users/' + id), this.us.authHeaders())
        .map((response: Response) => {
          let body = response.json().body;
          if (body.data && body.data.user) {
            return <IUserObject>response.json().body.data.user;
          } else {
            return Observable.throw('Invalid data received from service (get /users:id)');
          }
        })
        .catch(handleError);
    }

/*
    create(user: IUser): Observable<IUser> {
        return this.http.post('/api/users', user, this.jwt())
              .map((response: Response) => {
                let body = response.json().body;
                if (body.data && body.data.user) {
                  return <IUser>response.json().body.data.user;
                } else {
                  return Observable.throw('Invalid data received from service (post /api/user)');
                }
              })
              .catch(handleError);
    }

    update(user: IUser) {
        return this.http.put('/api/users/' + user.id, user, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: string) {
        return this.http.delete('/api/users/' + id, this.jwt()).map((response: Response) => response.json());
    }

*/


}
