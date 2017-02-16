
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

import { IDatasetObject } from 'jsmoney-server-api';

import { AccountService } from '../../../../_backend-services';
import { AppStateService } from '../../../../_app-services';

console.log('`Datasets list` component loaded asynchronously');

// fake data
const fakeSatasets: IDatasetObject[] = [
    {
        id: '1',
        version: 11,
        name: 'Dataset-1',
        description: 'Dataset-1 desc',
        currency: 'EUR',
        additionalCurrencies: ['USD', 'GBP']
    },
        {
        id: '2',
        version: 22,
        name: 'Dataset-2',
        description: 'Dataset-2 desc',
        currency: 'JPY',
        additionalCurrencies: ['USD', 'GBP']
    },
        {
        id: '3',
        version: 33,
        name: 'Dataset-3',
        description: 'Dataset-3 desc',
        currency: 'USD',
        additionalCurrencies: []
    },
        {
        id: '4',
        version: 44,
        name: 'Dataset-4',
        description: 'Dataset-4 desc',
        currency: 'EUR',
        additionalCurrencies: ['USD']
    },

];

@Component({
    selector: 'dataset-list',
    templateUrl: './datasets.list.component.html',
})
export class DatasetsListComponent implements OnInit {

    // @Input() datasets: IDatasetObject[];
    constructor(
        private accountService: AccountService,
        private appStateService: AppStateService,
        private router: Router,
        private zone: NgZone
    ) { }

    public ngOnInit() {
        console.log('hello `Datasets List` component');
        if (!this.accountService) {
            console.log('Account service is null!!!');
        } else {
            this.accountService.test();
        }
        // this.datasets = fakeDatasets;
    }

    @Input()
    public getDatasets =
            (request: ListRequest): Observable<ListResponse<IDatasetObject>> => {
        console.log('Getting datasets from backend... ');

        return this.accountService
                .getDatasets()
                .map((ds: IDatasetObject[]) => {
                    return {
                        items: ds,
                        totalCount: ds.length,
                        loadedCount: ds.length
                    };
                });
      }

    public selectDataset(d: IDatasetObject): void {
        console.log('Selected dataset: ' + JSON.stringify(d, null, 4));
        this.appStateService.setDataset(d);
    }

    public editDataset(d: IDatasetObject): void {
        console.log('Edit dataset: ' + JSON.stringify(d, null, 4));
        this.zone.run(() => {
            this.router.navigate(['datasets/detail/edit/' + d.id]);
        });
    }

    public changeDataset(d: IDatasetObject): void {
        console.log('Rename dataset: ' + JSON.stringify(d, null, 4));
    }
}
