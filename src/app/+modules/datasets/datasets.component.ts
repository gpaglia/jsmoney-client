import {
  Component,
  OnInit,
} from '@angular/core';

import {
  SideMenu,
  SideMenuItem
} from '../../shared-components/+components/sidenav/sidenav.component';

console.log('`Datasets` component loaded asynchronously');

@Component({
  selector: 'datasets',
  styleUrls: ['./datasets.component.css'],
  templateUrl: './datasets.component.html',
})
export class DatasetsComponent implements OnInit {

  public ngOnInit() {
    console.log('hello `Datasets` component');
  }

}
