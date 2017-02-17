import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  DatasetsComponent,
  DatasetsListComponent,
  DatasetsDetailComponent,
  AccountsListComponent,
  AccountsDetailComponent
} from './+components';

import {
  DatasetResolver,
  AccountResolver
} from '../../_resolvers';

export const routes = [
  { path: '', children: [
    { path: '', component: DatasetsComponent, children: [
      { path: 'dslist', component: DatasetsListComponent },
      {
        path: 'dsdetail/:mode/:id',
        component: DatasetsDetailComponent,
        resolve: {
          dataset: DatasetResolver
        }
      },
      { path: 'acclist', component: AccountsListComponent },
      {
        path: 'accdetail/:mode/:id',
        component: AccountsDetailComponent,
        resolve: {
          account: AccountResolver
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
    DatasetResolver,
    AccountResolver
  ]
})
export class DatasetsRoutingModule { }
