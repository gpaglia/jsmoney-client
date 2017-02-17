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
} from '../../shared-components/+components/sidenav/sidenav.component';

console.log('`Datasets` component loaded asynchronously');

const menu: SideMenu = {
  id: 'datasets',
  title: 'Datasets & Accounts',
  text: '...',
  action: (menux: SideMenu, itemx: SideMenuItem) => { console.log('Action ' + itemx.id); },
  items: [
    {
      id: 'new-dataset',
      title: 'New Dataset',
      text: '...',
    },
    {
      id: 'list-datasets',
      title: 'List Datasets',
      text: '...',
    },
    {
      id: 'new-account',
      title: 'New Account',
      text: '...',
    },
    {
      id: 'list-accounts',
      title: 'List Accounts',
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
  ) { }

  public ngOnInit() {
    this.actId = undefined;
    menu.action = (menux: SideMenu, itemx: SideMenuItem) => {
      console.log('Action selected: ' + itemx.id);
      this.actId = itemx.id;
      if (this.actId === 'new-dataset') {
        this.router.navigate(['dsacc/dsdetail/new/?']);
      } else if (this.actId === 'list-datasets') {
        this.router.navigate(['dsacc/dslist']);
      } else if (this.actId === 'new-account') {
        this.router.navigate(['dsacc/accdetail/new/?']);
      } else if (this.actId === 'list-accounts') {
        this.router.navigate(['dsacc/acclist']);
      }
    };
    console.log('hello `Datasets` component');
  }

}
