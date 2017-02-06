import { IApiError } from 'jsmoney-server-api';

export class BackendError implements IApiError {
    name: string;
    message: string;
    status: number;
    otherInfo: any;

    constructor(error: IApiError, otherInfo?: any);
    constructor(message: string, status?: number, otherInfo?: any);

    constructor(errorOrMessage: IApiError | string, otherInfoOrStatus?: any | number, otherInfo?: number) {

        this.name = this['constructor'].name;
        if (arguments.length === 3) {
            this.message = errorOrMessage as string;
            this.status = otherInfoOrStatus as number;
            this.otherInfo = otherInfo || {};
        } else if (arguments.length === 2) {
            if (typeof(errorOrMessage) === 'string') {
                this.message = errorOrMessage as string;
                this.status = otherInfoOrStatus as number;
            } else {
                this.message = (errorOrMessage as IApiError).message;
                this.status = (errorOrMessage as IApiError).status;
                this.otherInfo = otherInfoOrStatus as any || {};
            }
        } else {
            if (typeof(errorOrMessage) === 'string') {
                this.message = errorOrMessage as string;
                this.status = -1;
            } else {
                this.message = (errorOrMessage as IApiError).message;
                this.status = (errorOrMessage as IApiError).status;
            }
            this.otherInfo = {};
        }
    }
}