import { DatasetsComponent } from './datasets.component';
import { DatasetsListComponent } from './+components/list/datasets.list.component';
import { DatasetsNewComponent } from './+components/new/datasets.new.component';

export const routes = [
  { path: '', children: [
    { path: '', component: DatasetsComponent, children: [
      { path: 'list', component: DatasetsListComponent },
      { path: 'new', component: DatasetsNewComponent },
      { path: 'edit/:id', component: DatasetsListComponent }
    ] },
  ]},
];
