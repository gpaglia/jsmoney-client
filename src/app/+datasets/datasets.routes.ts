import { DatasetsComponent } from './datasets.component';
import { DatasetDetailComponent } from './+dataset.detail/dataset.detail.component';

export const routes = [
  { path: '', children: [
    { path: '', component: DatasetsComponent },
    { path: 'dataset-detail', component: DatasetDetailComponent }
  ]},
];
