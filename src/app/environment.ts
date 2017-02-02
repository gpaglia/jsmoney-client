// Angular 2
import {
  enableDebugTools,
  disableDebugTools
} from '@angular/platform-browser';

import {
  Injector,
  ReflectiveInjector,
  ApplicationRef,
  enableProdMode
} from '@angular/core';

import {
  FormBuilder
} from '@angular/forms';

import { DataResolver } from './_resolvers/app.resolver';

import { BackendHttp } from './_services/backend.http';
import { Http } from '@angular/http';

// Mock backend 
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';
import { fakeBackendProvider } from './_helpers/fake-backend'

import {
  ConfigService,
  AppStateService,
  AuthenticationService,
  AlertService
} from './_services';

// Get holt of Config service, we need an explicit Injector for this
const injector: Injector = ReflectiveInjector.resolveAndCreate([ConfigService]);
var configService = injector.get(ConfigService);

// Environment Providers
let PROVIDERS: any[] = [
  AppStateService,
  ConfigService,
  AuthenticationService,
  AlertService,
  FormBuilder
  // other common env directives
];

// an array of services to resolve routes with data
let RESOLVER_PROVIDERS = [
  DataResolver,
  MockBackend,
  BaseRequestOptions,
  // other common data resolvers
];

// Angular debug tools in the dev console
// https://github.com/angular/angular/blob/86405345b781a9dc2438c0fbe3e9409245647019/TOOLS_JS.md
let _decorateModuleRef = <T>(value: T): T => { return value; };

if ('production' === ENV) {
  enableProdMode();

  // Production
  _decorateModuleRef = (modRef: any) => {
    disableDebugTools();

    return modRef;
  };

  PROVIDERS = [
    ...PROVIDERS,
    // always use Http in production
    { provide: BackendHttp, useExisting: Http },
    // custom providers in production
  ];

  RESOLVER_PROVIDERS = [
    ...RESOLVER_PROVIDERS,
    // custom resolver providers in production
  ];


} else {

  _decorateModuleRef = (modRef: any) => {
    const appRef = modRef.injector.get(ApplicationRef);
    const cmpRef = appRef.components[0];

    let _ng = (<any> window).ng;
    enableDebugTools(cmpRef);
    (<any> window).ng.probe = _ng.probe;
    (<any> window).ng.coreTokens = _ng.coreTokens;
    return modRef;
  };

  // Development
  PROVIDERS = [
    ...PROVIDERS,
    // fake backend services depending on config object
    fakeBackendProvider,
    //(configService.isFakeBackend() ? fakeBackendProvider : { provide: BackendHttp, useExisting: Http }),
    // custom providers in development
  ];

  RESOLVER_PROVIDERS = [
    ...RESOLVER_PROVIDERS,
    // custom resolver providers in development
  ];
}

export const decorateModuleRef = _decorateModuleRef;

export const ENV_PROVIDERS = [
  ...PROVIDERS
];

export const APP_RESOLVER_PROVIDERS = [
  ...RESOLVER_PROVIDERS
]
