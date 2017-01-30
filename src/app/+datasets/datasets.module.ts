import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { routes } from './datasets.routes';
import { DatasetsComponent } from './datasets.component';
import { DatasetDetailComponent } from './+dataset.detail/dataset.detail.component';

console.log('`Datasets` bundle loaded asynchronously');

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    DatasetsComponent,
    DatasetDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ],
})
export class DatasetsModule {
  public static routes = routes;
}
