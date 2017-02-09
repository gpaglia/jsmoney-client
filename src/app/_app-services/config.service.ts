import { Injectable } from '@angular/core';
import * as merge from 'merge';
import * as _config from '../../../config/config';

@Injectable()
export class ConfigService {
  private configObject: any;

  constructor() {
    let env: string = process.env.NODE_ENV;
    let commonConfig = _config['common'];
    let envConfig = _config[env];

    console.log('Common config: ' + JSON.stringify(commonConfig));
    console.log('Env config: ' + env + ' ' + JSON.stringify(envConfig));

    this.configObject = merge(true, true, commonConfig, envConfig);
    console.log('Result config: ' + JSON.stringify(this.configObject));
  }

  public getApiPrefix() {
    return 'http://'
              + this.configObject.api.host
              + ':'
              + this.configObject.api.port
              + this.configObject.api.base
              + this.configObject.api.version;
  }

  public api(segment: string) {
    return this.getApiPrefix() + segment;
  }

  public isFakeBackend(): boolean {
    return !!this.configObject['fake-backend'];
  }

}
