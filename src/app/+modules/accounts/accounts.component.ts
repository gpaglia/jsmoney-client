import {
  Component,
  OnInit,
} from '@angular/core';
/*
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */

console.log('`Accounts` component loaded asynchronously');

@Component({
  selector: 'datasets',
  template: `
    <h1>Hello from Accounts</h1>
    <router-outlet></router-outlet>
  `,
})
export class AccountsComponent implements OnInit {

  public ngOnInit() {
    console.log('hello `Accounts` component');
  }

}
