
import {
  Component,
  OnInit,
  Input
} from '@angular/core';

import { Observable } from 'rxjs';

import { ListRequest, ListResponse, SortParameter } from 'right-angled';

import { IDatasetObject } from 'jsmoney-server-api';



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

    @Input() datasets: IDatasetObject[];

    public ngOnInit() {
        console.log('hello `Datasets List` component');
        this.datasets = fake_datasets;
    }

    public getDatasets(request: ListRequest): Observable<ListResponse<IDatasetObject>>  {
        return Observable.of({
            items: fake_datasets,
            totalCount: fake_datasets.length,
            loadedCount: fake_datasets.length
        } as ListResponse<IDatasetObject>);
    }

    public selectDataset(d: IDatasetObject): void {
        console.log('Selected dataset: ' + JSON.stringify(d, null, 4));
    }

}
