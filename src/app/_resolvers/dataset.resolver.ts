import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { AccountService } from '../_backend-services';

import { IDatasetObject } from 'jsmoney-server-api';

@Injectable()
export class DatasetResolver implements Resolve<IDatasetObject> {

  constructor(
    private accountService: AccountService,
    private router: Router
    ) {};

  public resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<IDatasetObject> {
    let id: string = route.params['id'];
    let mode: string = route.params['mode'];

    if (id === '?' && mode === 'new') {
      return Observable.of(undefined);
    } else {
      return this.accountService
                  .getDatasetById(id)
                  .map((ds) => {
                    if (ds != null) {
                      console.log('Resolved dataset ' + JSON.stringify(ds));
                      return ds;
                    } else {
                      this.router.navigate(['/datasets']);
                    }
                  })
                  .first();
    }
  }
}
