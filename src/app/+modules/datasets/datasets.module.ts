import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { routes } from './datasets.routes';
import { DatasetsComponent } from './datasets.component';
import { DatasetsListComponent } from './+components/list/datasets.list.component';
// right-angled
import { RTModule } from 'right-angled';

console.log('`Datasets` bundle loaded asynchronously');

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    DatasetsComponent,
    DatasetsListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    FlexLayoutModule,
    RTModule,
    RouterModule.forChild(routes),
  ],
})
export class DatasetsModule {
  public static routes = routes;
}
