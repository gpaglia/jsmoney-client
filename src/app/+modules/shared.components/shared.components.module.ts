import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
    SidenavComponent
} from './+components/sidenav/sidenav.component';

console.log('`SharedComponents` bundle loaded');

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    SidenavComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    SidenavComponent
  ]
})
export class SharedComponentsModule {
}
