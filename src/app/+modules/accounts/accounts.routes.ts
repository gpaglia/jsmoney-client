import { AccountsComponent } from './accounts.component';

export const routes = [
  { path: '', children: [
    { path: '', component: AccountsComponent }
  ]},
];
