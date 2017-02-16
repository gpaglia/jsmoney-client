import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import {
  BEARER,
  IUserObject,
  IDatasetObject
} from 'jsmoney-server-api';

import { Subject, Observable } from 'rxjs';

const USER_KEY = 'USER_STATE';
const DATASET_KEY = 'DATASET';

export type UserStateType = {
  user: IUserObject,
  token: string
};

export type InternalStateType = {
  [key: string]: any
};

@Injectable()
export class AppStateService {
  private userSubject = new Subject<IUserObject>();
  private datasetSubject = new Subject<IDatasetObject>();

  private _state: InternalStateType = { };

  // constructor() {}

  public resetAppState(newState: InternalStateType) {
    this._state = newState;
  }

  public getAppState(prop?: string) {
    // use our state getter for the clone
    const state = this._clone(this._state);
    return state.hasOwnProperty(prop) ? state[prop] : state;
  }

  public setAppState(prop: string, value: any) {
    // internally mutate our state
    return this._state[prop] = value;
  }

  // User state
  public clear(): void {
    localStorage.removeItem(USER_KEY);
    this.userSubject.next(undefined as IUserObject);
  }

  public isLoggedIn(): boolean {
    let state = this.getUserState();
    return !!state && !!state.token && !!state.user;
  }

  public getToken(): string {
    let state = this.getUserState();
    return state ? state.token : undefined;
  }

  public getUser(): IUserObject {
    let state = this.getUserState();
    return state ? state.user : undefined;
  }

  public setUser(nuser: IUserObject, ntoken: string): void {
    let newState: UserStateType = {user: nuser, token: ntoken};
    localStorage.setItem(USER_KEY, JSON.stringify(newState));
    console.log('User state changing ... ');
    this.userSubject.next(nuser);
  }

  public getUserAsync(): Observable<IUserObject> {
    return this.userSubject.asObservable();
  }

  public getUserState(): UserStateType {
    return JSON.parse(localStorage.getItem(USER_KEY)) as UserStateType ;
  }

  public getDataset(): IDatasetObject {
    return JSON.parse(localStorage.getItem(DATASET_KEY)) as IDatasetObject;
  }

  public getDatasetAsync(): Observable<IDatasetObject> {
    return this.datasetSubject.asObservable();
  }

  public setDataset(d: IDatasetObject): void {
    localStorage.setItem(DATASET_KEY, JSON.stringify(d));
    console.log('Dataset changing ... ');
    this.datasetSubject.next(d);
  }

  private _clone(object: InternalStateType) {
    // simple object clone
    return JSON.parse(JSON.stringify( object ));
  }

}
