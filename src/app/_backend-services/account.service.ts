import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BackendServiceHelper, BodyParser } from './backend.service.helper';
import { ConfigService, AppStateService } from '../_app-services';

import { 
    IDatasetObject, 
    IAccountObject, 
    AccountType,
    IUserObject, 
    IBody, 
    makeBody } from 'jsmoney-server-api';

@Injectable()
export class AccountService {
    constructor(
        private config: ConfigService,
        private appState: AppStateService,
        private backend: BackendServiceHelper
    ) { }

    public test() {
        console.log('AccountService test');
    }

    public getDatasets(): Observable<IDatasetObject[]> {
        return this.backend.get(['datasets'], null, true);
    }

    public getDatasetById(id: string): Observable<IDatasetObject> {
        return this.backend.get(['datasets', ':id'], {'id': id}, null, null, true);
    }

    public createDataset(dataset: IDatasetObject): Observable<IDatasetObject> {
        return this.backend.postEmbed(['datasets'], dataset, null, true);
    }

    public getAccounts(datasetId: string): Observable<IAccountObject[]> {
        return this.backend.get(['datasets', ':id', 'accounts'], {'id': datasetId}, null, null, true);
    }

    public getAccountById(id: string): Observable<IAccountObject> {
        return this.backend.get(['accounts', ':id'], {'id': id}, null, null, true);
    }

     public createAccount(datasetId: string, account: IAccountObject): Observable<IAccountObject> {
        return this.backend.postEmbed(['datasets', ':id', 'accounts'], {'id': datasetId}, null, account, null, true);
    }

/*
    public abstract updateDataset(dataset: IDatasetObject): Observable<IDatasetObject>;

    public abstract deleteDataset(id: string): Observable<void>;

*/


}

