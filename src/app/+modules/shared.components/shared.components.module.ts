import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// right-angled
import { RTModule } from 'right-angled';

import {
    SidenavComponent,
    CurrencySelectorComponent
} from './+components';

console.log('`SharedComponents` bundle loaded');

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    SidenavComponent,
    CurrencySelectorComponent
  ],
  imports: [
    CommonModule,
    RTModule
  ],
  exports: [
    SidenavComponent,
    CurrencySelectorComponent
  ]
})
export class SharedComponentsModule {
}
