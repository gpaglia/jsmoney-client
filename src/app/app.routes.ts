import { Routes } from '@angular/router';
import { ProfileComponent } from './+components/profile';
import { AboutComponent } from './+components/about';
import { LoginComponent } from './+components/login';
import { HomeComponent } from './+components/home';

import { RegisterComponent } from './+components/register';

import { NoContentComponent } from './+components/no-content';

import { DataResolver } from './app.resolver';

export const ROUTES: Routes = [
  { path: '',      component: ProfileComponent },
  { path: 'profile',  component: ProfileComponent },
  { path: 'home',  component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'datasets', loadChildren: './+modules/datasets#DatasetsModule'},
  { path: 'accounts', loadChildren: './+modules/accounts#AccountsModule'},
  { path: '**',    component: NoContentComponent },
];
