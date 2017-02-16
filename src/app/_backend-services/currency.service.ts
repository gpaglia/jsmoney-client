import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import {
    BackendServiceHelper,
    BodyParser,
    QryParams
} from './backend.service.helper';

import { ConfigService } from '../_app-services';

import { ICurrencyObject, IBody, makeBody } from 'jsmoney-server-api';

@Injectable()
export class CurrencyService {
    constructor(
        private config: ConfigService,
        private backend: BackendServiceHelper
    ) { }

    public getCurrencies(major?: boolean): Observable<ICurrencyObject[]>;
    public getCurrencies(codes?: string[]): Observable<ICurrencyObject[]>;
    public getCurrencies(majorOrCodes?: boolean | string[]): Observable<ICurrencyObject[]> {
        let qryParams: QryParams = undefined;
        if (majorOrCodes != null
                && typeof(majorOrCodes) === 'boolean'
                && (majorOrCodes as boolean)) {
            qryParams = { major: 'true' };
        } else if (majorOrCodes != null
                && majorOrCodes instanceof Array) {
            qryParams = { codes: (majorOrCodes as string[]) };
        }
        return this.backend.get(
            ['currencies'],
            null,
            qryParams,
            null,
            true);
    }

    public getCurrencyByCode(code: string): Observable<ICurrencyObject> {
        return this.backend.get(
            ['currencies', ':id'],
            { code },
            null,
            null,
            true);
    }

}
