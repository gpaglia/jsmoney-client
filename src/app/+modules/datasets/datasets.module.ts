import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  DatasetsComponent,
  DatasetsListComponent,
  DatasetsDetailComponent,
  AccountsListComponent,
  AccountsDetailComponent
} from './+components';

import { DatasetsRoutingModule } from './datasets.routing.module';

// right-angled
import { RTModule } from 'right-angled';

// ng2-select

import { SelectModule } from 'ng2-select';

// Shared components
import { SharedComponentsModule } from '../shared-components/shared-components.module';

console.log('`Datasets` bundle loaded asynchronously');

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    DatasetsComponent,
    DatasetsListComponent,
    DatasetsDetailComponent,
    AccountsListComponent,
    AccountsDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RTModule,
    SelectModule,
    SharedComponentsModule,
    DatasetsRoutingModule,
  ],
})
export class DatasetsModule {}
