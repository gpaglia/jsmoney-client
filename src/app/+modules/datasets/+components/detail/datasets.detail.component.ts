
import {
    Component,
    OnInit,
    OnDestroy,
    Input
} from '@angular/core';

import {
    Router,
    ActivatedRoute,
    Params
} from '@angular/router';

import {
    FormBuilder,
    FormGroup,
    Validators
} from '@angular/forms';

import { Observable } from 'rxjs/observable';
import { Subscription } from 'rxjs';

import {
    AccountService,
    CurrencyService
} from '../../../../_backend-services';

import { AlertService } from '../../../../_app-services';

import {
    IDatasetObject,
    ICurrencyObject
} from 'jsmoney-server-api';

console.log('`Datasets new` component loaded asynchronously');

type CurrencyList = Array<{
    id: string,
    text: string
}>;

@Component({
    selector: 'dataset-detail',
    templateUrl: './datasets.detail.component.html',
})
export class DatasetsDetailComponent implements OnInit, OnDestroy {

    @Input() public dataset: IDatasetObject;
    @Input() public datasetForm: FormGroup;
    @Input() public mode: 'new' | 'edit' | 'view';
    @Input() public id: string;
    @Input() public allcurrencies: boolean = false;
    @Input() public clist: CurrencyList;
    private paramSub: Subscription;
    private dataSub: Subscription;

    constructor(
        private formBuilder: FormBuilder,
        private accountService: AccountService,
        private route: ActivatedRoute,
        private router: Router,
        private alert: AlertService,
        private currencyService: CurrencyService
    ) { }

    public ngOnInit() {
        console.log('hello `Datasets New` component');
        this.currencyService.getCurrencies(!this.allcurrencies).subscribe(
            (carray: ICurrencyObject[]) => {
                this.clist = carray.map((c) => {
                    return {
                        id: c.code,
                        text: c.description
                    };
                });
            }
        );

        this.dataSub = this.route.data.subscribe(
            (data: { dataset: IDatasetObject }) => {
                this.dataset = data.dataset;
            }
        );

        this.paramSub = this.route.params.subscribe(
            (params: Params) => {
                this.id = params['id'];
                this.mode = params['mode'];
                if (this.mode === 'new') {
                    this.id = undefined;
                    this.dataset = undefined;
                    if (this.datasetForm != null) {
                        this.datasetForm.reset();
                    }
                }
            });

        this.loadFormGroup(this.dataset);

        console.log('Dataset detail started on mode '
                    + this.mode
                    + ' and dataset '
                    + JSON.stringify(this.dataset));
    }

    public ngOnDestroy() {
        this.paramSub.unsubscribe();
    }

    public cancel() {
        console.log('cancel');
    }

    public addCurrencies() {
        console.log('add currencies');
    }

    public newDataset() {
        console.log('newDataset() ');
        let newDataset: IDatasetObject = {
            id: null,
            version: null,
            name: this.datasetForm.controls['name'].value,
            description: this.datasetForm.controls['description'].value,
            currency: this.datasetForm.controls['currency'].value,
            additionalCurrencies: []
            // additionalCurrencies: JSON.parse(
            // '[' + this.datasetForm.controls['additionalCurrencies'].value + ']')
        };
        this.accountService
            .createDataset(newDataset)
            .subscribe(
            (data) => {
                console.log('Created dataset ' + JSON.stringify(data));
                this.alert.success('Created new dataset');

            },
            (error) => {
                console.log('Error in newDataset() ' + JSON.stringify(error));
                this.alert.error('Dataset not created');
            });

        this.datasetForm.reset();
    }

    // Private methods
    private loadFormGroup(dataset?: IDatasetObject): void {
        this.datasetForm = this.formBuilder.group({
            name: [
                dataset && dataset.name ? dataset.name : '',
                Validators.required
            ],
            description: [
                dataset && dataset.description ? dataset.description : '',
                Validators.required
            ],
            currency: [
                dataset && dataset.currency ? dataset.currency : '',
                Validators.required
            ],
            additionalCurrencies: [
                dataset && dataset.additionalCurrencies ?
                    dataset.additionalCurrencies.join(',') : ''
            ]
        });
    }

}
