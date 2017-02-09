import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {
  NgModule,
  ApplicationRef
} from '@angular/core';
import {
  removeNgStyles,
  createNewHosts,
  createInputTransfer
} from '@angularclass/hmr';
import {
  RouterModule,
  PreloadAllModules
} from '@angular/router';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS, APP_RESOLVER_PROVIDERS } from './environment';
import { AppStateService, InternalStateType } from './_app-services/app.state.service';
import { ROUTES } from './app.routes';
// App is our top level component
import { AppComponent } from './app.component';
import { HomeComponent } from './+components/home';
import { AboutComponent } from './+components/about';
import { LoginComponent } from './+components/login';
import { RegisterComponent } from './+components/register';
import { NoContentComponent } from './+components/no-content';
import { ProfileComponent } from './+components/profile';
import { XLargeDirective } from './_directives/x-large';
import {
  AlertModule
} from 'ng2-bootstrap';

// Styles
import '../styles/styles.scss';
import '../styles/headings.css';

// this is for Bootstrap
import 'tether/dist/js/tether.min.js';
import 'jquery/dist/jquery.slim.min.js';
import 'bootstrap/dist/js/bootstrap.min.js';

type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    AboutComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    NoContentComponent,
    ProfileComponent,
    XLargeDirective
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AlertModule.forRoot(),
    RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules })
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_RESOLVER_PROVIDERS
  ]
})
export class AppModule {

  constructor(
    public appRef: ApplicationRef,
    public appState: AppStateService
  ) {}

  public hmrOnInit(store: StoreType) {
    if (!store || !store.state) {
      return;
    }
    console.log('HMR store', JSON.stringify(store, null, 2));
    // set state
    this.appState.resetAppState(store.state);
    // set input values
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  public hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
    // save state
    const state = this.appState.getAppState();
    store.state = state;
    // recreate root elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // save input values
    store.restoreInputValues  = createInputTransfer();
    // remove styles
    removeNgStyles();
  }

  public hmrAfterDestroy(store: StoreType) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }

}
