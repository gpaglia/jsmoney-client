import { Injectable } from '@angular/core';
import { Headers, RequestOptions, RequestOptionsArgs, Response } from '@angular/http';
import { ConfigService, AppStateService, BackendHttp } from '../_app-services';

import { BackendError } from './backend.error';

import { Observable } from 'rxjs/observable';

import { BEARER, IBody, makeBody, IApiError } from 'jsmoney-server-api';


export type BodyParser<U> = (body: any) => U;
export type UrlParams = { [name: string]: string };
export type QryParams = { [name: string]: (string | string[] | UrlParams) };


@Injectable()
export class BackendServiceHelper {
    constructor(
        private http: BackendHttp,
        private config: ConfigService,
        private appState: AppStateService
    ) { }

    public get<T>(
        segments: string[],
        parser: BodyParser<T>,
        auth: boolean): Observable<T|BackendError>;

    public get<T>(
        segments: string[],
        urlParams: UrlParams,
        qryParams: QryParams,
        parser: BodyParser<T>,
        auth: boolean): Observable<T|BackendError>;

    public get<T>(
        segments: string[],
        urlParamsOrParser: UrlParams | BodyParser<T>,
        qryParamsOrAuth: QryParams | boolean,
        parser?: BodyParser<T>,
        auth?: boolean): Observable<T|BackendError> {

        console.log('Entering Backend get ' + JSON.stringify(segments));

        let urlParams: UrlParams = undefined;
        let qryParams: QryParams = undefined;

        if (arguments.length === 5) {
            qryParams = qryParamsOrAuth as QryParams;
            urlParams = urlParamsOrParser as UrlParams;
        } else {
            auth = qryParamsOrAuth as boolean;
            parser = urlParamsOrParser as BodyParser<T>;
        }

        parser = parser || this.defaultParser;

        let url = this.makeUrl(segments, urlParams, qryParams);

        console.log('Backend get: url ' + url + ' auth ' + auth);

        return this.http
            .get(url, this.makeRequestOptions(auth))
            .map((response: Response) => {
                let resbody: T = parser(response.json());
                if (resbody) {
                    return resbody;
                } else {
                    return Observable.throw('Invalid data received from service or parser ' + url);
                }
            })
            .catch(makeErrorHandler(segments));
    }

    public postEmbed<S, T>(
        segments: string[],
        body: S,
        parser: BodyParser<T>,
        auth: boolean): Observable<T|BackendError>;

    public postEmbed<S, T>(
        segments: string[],
        urlParams: UrlParams,
        qryParams: QryParams,
        body: S,
        parser: BodyParser<T>,
        auth: boolean): Observable<T|BackendError>;


    public postEmbed<S, T>(
        segments: string[],
        urlParamsOrBody: UrlParams | S,
        qryParamsOrParser: QryParams | BodyParser<T>,
        bodyOrAuth: S | boolean,
        parser?: BodyParser<T>,
        auth?: boolean): Observable<T|BackendError> {

        let urlParams: UrlParams = undefined;
        let qryParams: QryParams = undefined;
        let body: S;

        if (arguments.length === 6) {
            urlParams = urlParamsOrBody as UrlParams;
            qryParams = qryParamsOrParser as QryParams;
            body = bodyOrAuth as S;
        } else {
            auth = bodyOrAuth as boolean;
            parser = qryParamsOrParser as BodyParser<T>;
            body = urlParamsOrBody as S;
        }

        return this.post<IBody<S>, T>(segments, urlParams, qryParams, makeBody(body), parser, auth);

    }

    public post<S, T>(
        segments: string[],
        body: S,
        parser: BodyParser<T>,
        auth: boolean): Observable<T|BackendError>;

    public post<S, T>(
        segments: string[],
        urlParams: UrlParams,
        qryParams: QryParams,
        body: S,
        parser: BodyParser<T>,
        auth: boolean): Observable<T|BackendError>;

    public post<S, T>(
        segments: string[],
        urlParamsOrBody: UrlParams | S,
        qryParamsOrParser: QryParams | BodyParser<T>,
        bodyOrAuth: S | boolean,
        parser?: BodyParser<T>,
        auth?: boolean): Observable<T|BackendError> {

        console.log('Entering Backend post ' + JSON.stringify(segments));

        let urlParams: UrlParams = undefined;
        let qryParams: QryParams = undefined;
        let body: S;

        if (arguments.length === 6) {
            urlParams = urlParamsOrBody as UrlParams;
            qryParams = qryParamsOrParser as QryParams;
            body = bodyOrAuth as S;
        } else {
            auth = bodyOrAuth as boolean;
            parser = qryParamsOrParser as BodyParser<T>;
            body = urlParamsOrBody as S;
        }

        parser = parser || this.defaultParser;

        let url = this.makeUrl(segments, urlParams, qryParams);

        console.log('Backend post: url ' + url + ' auth ' + auth + ' body ' + JSON.stringify(body, null, 4));
        return this.http.post(url, body, this.makeRequestOptions(auth))
            .map((response: Response) => {
                let resbody: T = parser(response.json());
                if (resbody) {
                    return resbody;
                } else {
                    throw new BackendError('Invalid data received from service or parser ' + url, -1, {});
                }
            })
            .catch(makeErrorHandler(segments));
    }


    private defaultParser<T>(body: any): T {
        console.log('Default parser, body ' + JSON.stringify(body, null, 4));
        return (body as IBody<T>).data;
    }

    // the segments should NOT start with a slash
    // in any case, leading slashes will be removed
    private makeUrl(segments: string[], urlParams: UrlParams, qryParams: QryParams): string {
        let url = this.config.getApiPrefix();
        for (let s of segments) {
            if (!s) {
                throw 'Invalid url params';
            }
            s = s.replace(/^[/]*/, '');

            if (s.startsWith(':')) {
                let name = s.substr(1);
                if (!urlParams || !urlParams.hasOwnProperty(name)) {
                    throw 'Invalid url params (name not found: ' + name + ')';
                }
                s = urlParams[name];
            }
            url = url + '/' + s;
        }

        if (!qryParams) {
            return url;
        }

        let qmark: boolean = false;

        for (let k in qryParams) {
            let qp: string | string[] | UrlParams = qryParams[k];
            if (!qmark) {
                url = url + '?';
                qmark = true;
            } else {
                url = url + '&';
            }
            if (typeof qp === 'string') {
                url = url + k + '=' + qp;
            } else if (qp instanceof Array) {
                url = url + k + '=' + qp.join('+');
            } else if (qp instanceof Object) {
                let first: boolean = true;
                for (let subk in qp) {
                    if (!first) {
                        url = url + '&';
                    } else {
                        first = false;
                    }
                    url = url + k + '[' + subk + ']=' + qp[subk];
                }
            } else {
                throw 'Invalid query params';
            }
        }

        return url;

    }

    private makeRequestOptions(auth: boolean): RequestOptionsArgs {
        let hdrs = new Headers();
        hdrs.append('Content-Type', 'application/json');
        if (auth) {
            hdrs.append('Authorization', this.appState.getToken());
        }
        let opt = { headers: hdrs }
        console.log('Backend svc helper: headers: ' + JSON.stringify(opt, null, 4));
        return opt;
    }

}

function makeErrorHandler(segments: string[]): (error: Response | BackendError | IApiError | any) => Observable<BackendError> {
    return (error: Response | BackendError | IApiError | any) => {

        let newError: BackendError;

        console.error('Error (in handler) ' + JSON.stringify(error, null, 4));

        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body, null, 4);
            let errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
            newError = new BackendError(
                error.statusText || ('Status: ' + error.status),
                error.status,
                {
                    errorBody: body,
                    apiSegments: segments
                });
        } else if (error instanceof BackendError) {
            newError = error as BackendError;
            if (! newError.otherInfo.apiSegments) {
                newError.otherInfo.apiSegments = segments;
            }
        } else if (!!error.name && !!error.message && !!error.status) {
            newError = new BackendError(
                error.message, 
                error.status, 
                {
                    errorBody: JSON.stringify(error),
                    otherInfo: error.otherInfo,
                    apiSegments: segments
                });   
        } else {
            newError = new BackendError(
                JSON.stringify(error),
                -1,
                {}
            );
        }
        return Observable.throw(newError);
    };
}


function handleError(error: Response | Error | any) {


    console.error('Handle Error ' + JSON.stringify(error, null, 4));

    let errMsg: string;
    if (error instanceof Response) {
        const body = error.json() || '';
        const err = body.error || JSON.stringify(body, null, 4);
        errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else if (error instanceof Error) {
        errMsg = error.message ? error.message : error.toString();
    } else {
        errMsg = JSON.stringify(error);
    }
    return Observable.throw(errMsg);
}



