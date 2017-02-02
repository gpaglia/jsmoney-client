
import {
  Component,
  OnInit,
  Input
} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { IDatasetObject } from 'jsmoney-server-api';


console.log('`Datasets new` component loaded asynchronously');



@Component({
    templateUrl: './datasets.new.component.html',
})
export class DatasetsNewComponent implements OnInit {

    @Input() dataset: IDatasetObject;
    @Input() datasetForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder
    ) {}

    public ngOnInit() {
        console.log('hello `Datasets New` component');
    }

    public createNewDataset() {
        
    }

}
