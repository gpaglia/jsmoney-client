
import {
    Component,
    OnInit,
    Input
} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AccountService } from '../../../../_backend-services';

import { IDatasetObject } from 'jsmoney-server-api';

console.log('`Datasets new` component loaded asynchronously');

@Component({
    templateUrl: './datasets.new.component.html',
})
export class DatasetsNewComponent implements OnInit {

    @Input() public dataset: IDatasetObject;
    @Input() public datasetForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private accountService: AccountService
    ) { }

    public ngOnInit() {
        console.log('hello `Datasets New` component');
        this.datasetForm = this.formBuilder.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            currency: ['', Validators.required],
            additionalCurrencies: ['']
        });
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

                },
                (error) => {
                    console.log('Error in newDataset() ' + JSON.stringify(error));
                }
            );
    }
}
