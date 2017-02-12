/*
 * Angular 2 decorators and services
 */
import {
    Component,
    OnInit,
    OnDestroy,
    ViewEncapsulation,
    Input
} from '@angular/core';

import { Observable } from 'rxjs/observable';

import { ListRequest, ListResponse, SortParameter } from 'right-angled';

import {
    AlertService,
    AlertMessage
} from '../../../../_app-services';

import {
    CurrencyService
} from '../../../../_backend-services';

import { ICurrencyObject } from 'jsmoney-server-api';

/*
 * App Component
 * Top Level Component
 */
@Component({
    selector: 'currency-selector',
    styleUrls: [
        './currency.selector.component.css'
    ],
    templateUrl: './currency.selector.component.html'
})
export class CurrencySelectorComponent implements OnInit, OnDestroy {
    @Input() public mode: 'single' | 'multiple' | 'view';
    @Input() public selector: boolean | string[];
    public currencies: ICurrencyObject[];

    constructor(
        private alertService: AlertService,
        private currencyService: CurrencyService
    ) { }

    public getCurrencies =
        (request: ListRequest): Observable<ListResponse<ICurrencyObject>> => {
        return this.currencyService.getCurrencies(true);
    }

    public selectCurrency(code: string) {
        console.log('Currency ' + code + ' selected');
    }

    public confirm() {
        console.log('Confirm');
    }

    public cancel() {
        console.log('cancel');
    }

    public ngOnInit() {
        console.log('Initialize Currency Selector component');
    }

    public ngOnDestroy() {
        console.log('Destroy Currency Selector component');
    }
}
