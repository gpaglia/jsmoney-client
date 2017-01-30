import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import { BEARER, IUserObject } from 'jsmoney-server-api';
import { Subject, Observable } from 'rxjs';

const STORAGE_KEY = 'USER_STATE';

export type UserStateType = {
  user: IUserObject,
  token: string
};

@Injectable()
export class UserStateService {
  private subject = new Subject<IUserObject>();

  constructor() {

  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.subject.next(undefined as IUserObject);
  }

  isLoggedIn(): boolean {
    let state = this.getState();
    return state != undefined && state.token != undefined && state.user != undefined;
  }

  getToken(): string {
    let state = this.getState();
    return state ? state.token : undefined;
  }

  getUser(): IUserObject {
    let state = this.getState();
    return state ? state.user : undefined;
  }

  setState(nuser: IUserObject, ntoken: string): void {
    let newState: UserStateType = {user: nuser, token: ntoken};
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    this.subject.next(nuser);
  }

  getUserAsync(): Observable<IUserObject> {
    return this.subject.asObservable();
  }

  getState(): UserStateType {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) as UserStateType ;
  }

  // create auth headers
  authHeaders(): RequestOptions {
      // create authorization header with jwt token
      if (this.isLoggedIn()) {
          let headers = new Headers({ 'Authorization': BEARER + ' ' + this.getToken() });
          return new RequestOptions({ headers: headers });
      } else {
        return new RequestOptions({});
      }
  }
}
