
import {
  Component,
  OnInit,
  Input,
  Inject
} from '@angular/core';

import { Observable } from 'rxjs';

import { ListRequest, ListResponse, SortParameter } from 'right-angled';

import { IDatasetObject } from 'jsmoney-server-api';

import { AccountService } from '../../../../_backend-services';
import { AppStateService } from '../../../../_app-services';



console.log('`Datasets list` component loaded asynchronously');

// fake data
const fake_datasets: IDatasetObject[] = [
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
    templateUrl: './datasets.list.component.html',
})
export class DatasetsListComponent implements OnInit {

    //@Input() datasets: IDatasetObject[];
    constructor(
        private accountService: AccountService
    ) { }

    public ngOnInit() {
        console.log('hello `Datasets List` component');
        if (!this.accountService) {
            console.log('Account service is null!!!');
        } else {
            this.accountService.test();
        }
        //this.datasets = fake_datasets;
    }

    getDatasets = (request: ListRequest): Observable<ListResponse<IDatasetObject>> => {
        console.log('Getting datasets from backend... ');
        try {
            this.accountService.test();
        } catch (error) {
            console.log('ERROR = ' + JSON.stringify(error, null, 4));
        }
        if (!this.accountService) {
            console.log('Account service is null in getDatasets() !!!');
        }

/*


        return Observable.of({
            items: fake_datasets,
            totalCount: fake_datasets.length,
            loadedCount: fake_datasets.length
        } as ListResponse<IDatasetObject>);

*/
    

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
    }

}
