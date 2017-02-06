import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { routes } from './datasets.routes';
import { DatasetsComponent } from './datasets.component';
import { DatasetsListComponent } from './+components/list/datasets.list.component';
import { DatasetsNewComponent } from './+components/new/datasets.new.component';


// right-angled
import { RTModule } from 'right-angled';

console.log('`Datasets` bundle loaded asynchronously');

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    DatasetsComponent,
    DatasetsListComponent,
    DatasetsNewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RTModule,
    RouterModule.forChild(routes),
  ],
})
export class DatasetsModule {
  public static routes = routes;
}
