import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DatasetsComponent } from './datasets.component';
import { DatasetsListComponent } from './+components/list/datasets.list.component';
import { DatasetsDetailComponent } from './+components/detail/datasets.detail.component';

import { DatasetResolver } from '../../_resolvers';

export const routes = [
  { path: '', children: [
    { path: '', component: DatasetsComponent, children: [
      { path: 'list', component: DatasetsListComponent },
      {
        path: 'detail/:mode/:id',
        component: DatasetsDetailComponent,
        resolve: {
          dataset: DatasetResolver
        }
      },
    ] },
  ]},
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    DatasetResolver
  ]
})
export class DatasetsRoutingModule { }
