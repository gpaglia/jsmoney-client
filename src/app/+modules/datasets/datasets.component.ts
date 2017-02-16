import {
  Component,
  OnInit,
  Input,
  NgZone
} from '@angular/core';

import { Router } from '@angular/router';

import {
  SideMenu,
  SideMenuItem
} from '../shared-components/+components/sidenav/sidenav.component';

console.log('`Datasets` component loaded asynchronously');

const menu: SideMenu = {
  id: 'datasets',
  title: 'Datasets & Accounts',
  text: '...',
  action: (menux: SideMenu, itemx: SideMenuItem) => {console.log('Action ' + itemx.id); },
  items: [
    {
      id: 'new-dataset',
      title: 'New Dataset',
      text: '...',
    },
    {
      id: 'list-datasets',
      title: 'List Dataset',
      text: '...',
    }
  ]
};

@Component({
  selector: 'datasets',
  styleUrls: ['./datasets.component.css'],
  templateUrl: './datasets.component.html',
})
export class DatasetsComponent implements OnInit {
  @Input() public dsmenu: SideMenu = menu;
  @Input() public actId;

  constructor(
    private router: Router,
    private zone: NgZone
  ) {}

  public ngOnInit() {
    this.actId = undefined;
    menu.action = (menux: SideMenu, itemx: SideMenuItem) => {
      console.log('Action selected: ' + itemx.id);
      this.actId = itemx.id;
      if (this.actId === 'new-dataset') {
        this.zone.run(() => {
          this.router.navigate(['datasets/detail/new/?']);
        });
      } else if (this.actId === 'list-datasets') {
        this.zone.run(() => {
          this.router.navigate(['datasets/list']);
        });
      }
    };
    console.log('hello `Datasets` component');
  }

}
