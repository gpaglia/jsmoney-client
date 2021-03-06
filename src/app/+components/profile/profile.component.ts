import {
  Component,
  OnInit
} from '@angular/core';

import { AppStateService } from '../../_app-services/app-state.service';
import { Title } from './title';
import { XLargeDirective } from './x-large';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'profile',
  // We need to tell Angular's Dependency Injection which providers are in our app.
  providers: [
    Title
  ],
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './profile.component.css' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  // Set our default values
  public localState = { value: '' };
  // TypeScript public modifiers
  constructor(
    public appState: AppStateService,
    public title: Title
  ) {}

  public ngOnInit() {
    console.log('hello `Profile` component');
    // this.title.getData().subscribe(data => this.data = data);
  }

  public submitState(value: string) {
    console.log('submitState', value);
    this.appState.setAppState('value', value);
    this.localState.value = '';
  }
}
