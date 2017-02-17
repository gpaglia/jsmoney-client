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

import { AppStateService } from '../_app-services';

import {
  IAccountObject,
  IDatasetObject
} from 'jsmoney-server-api';

@Injectable()
export class AccountResolver implements Resolve<IAccountObject> {

  constructor(
    private appStateService: AppStateService,
    private accountService: AccountService,
    private router: Router
  ) { };

  public resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<IAccountObject> {

    let dataset: IDatasetObject = this.appStateService.getDataset();
    let accid: string = route.params['id'];
    let mode: string = route.params['mode'];

    if (dataset == null) {
      console.log('No dataset selected');
      this.router.navigate(['/dsacc/dslist']);
      return Observable.of(undefined);
    } else if (accid === '?' && mode === 'new') {
      return Observable.of(undefined);
    } else {
      return this.accountService
        .getAccountById(dataset.id, accid)
        .map((acc) => {
          if (acc != null) {
            console.log('Resolved account ' + JSON.stringify(acc));
            return acc;
          } else {
            this.router.navigate(['/dsacc']);
            return Observable.of(undefined);
          }
        })
        .first();
    }
  }
}
