
import {
  Component,
  OnInit,
  Input,
  Inject,
  NgZone
} from '@angular/core';

import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { ListRequest, ListResponse, SortParameter } from 'right-angled';

import {
    IDatasetObject,
    IAccountObject,
    AccountType
} from 'jsmoney-server-api';

import { AccountService } from '../../../../_backend-services';
import { AppStateService } from '../../../../_app-services';

console.log('`Accounts list` component loaded asynchronously');

@Component({
    selector: 'accounts-list',
    templateUrl: './accounts-list.component.html',
})
export class AccountsListComponent implements OnInit {
    @Input() public dataset: IDatasetObject;

    // @Input() datasets: IDatasetObject[];
    constructor(
        private accountService: AccountService,
        private appStateService: AppStateService,
        private router: Router,
        private zone: NgZone
    ) { }

    public ngOnInit() {
        console.log('hello `Datasets List` component');

        this.appStateService.getDatasetAsync().subscribe(
            (ds) => {
                this.dataset = ds;
            }
        );
    }

    @Input()
    public getAccounts =
            (request: ListRequest): Observable<ListResponse<IAccountObject>> => {
        console.log('Getting accounts from backend... ');

        return this.accountService
                .getAccounts(this.dataset.id)
                .map((accs: IAccountObject[]) => {
                    return {
                        items: accs,
                        totalCount: accs.length,
                        loadedCount: accs.length
                    };
                });
      }

    public selectAccount(a: IAccountObject): void {
        console.log('Selected account: ' + JSON.stringify(a, null, 4));
    }

    public editAccount(a: IAccountObject): void {
        console.log('Edit account: ' + JSON.stringify(a, null, 4));
        this.router.navigate(['dsacc/accdetail/edit/' + a.id]);
    }

}
