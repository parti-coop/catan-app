import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { RequestOptions, ConnectionBackend, RequestMethod, Response, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { PartiEnvironment } from '../config/constant';
import { MyselfData } from '../providers/myself-data';

import 'rxjs/add/operator/catch';

@Injectable()
export class ApiHttp extends Http {
  constructor(backend: ConnectionBackend, defaultOptions: RequestOptions, private myselfData: MyselfData, private partiEnvironment: PartiEnvironment) {
    super(backend, defaultOptions);
  }

  public get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(RequestMethod.Get, url, null, options);
  }

  public post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(RequestMethod.Post, url, body, options);
  }

  public put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(RequestMethod.Put, url, body, options);
  }

  public delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(RequestMethod.Delete, url, null, options);
  }

  public patch(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(RequestMethod.Patch, url, body, options);
  }

  public head(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(RequestMethod.Head, url, null, options);
  }

  getRequestOptionArgs(method: RequestMethod, url: string, body?: string, options?: RequestOptionsArgs) : RequestOptionsArgs {
    if (options == null) {
      options = new RequestOptions();
    }
    if (options.headers == null) {
      options.headers = new Headers();
    }
    options.headers.append('Authorization', `Bearer ${this.myselfData.accessToken}`);
    options.headers.append('Content-Type', 'application/json');
    options.method = method;
    options.body = body;
    return options;
  }

  intercept(method: RequestMethod, url: string, body?: string, options?: RequestOptionsArgs): Observable<Response> {
    let requestOptions = this.getRequestOptionArgs(method, url, body, options);
    let apiUrl = `${this.partiEnvironment.apiBaseUrl}${url}`;

    return super.request(apiUrl, requestOptions).catch((error, source) => {
      if (error && error.status  == 401) {
        return this.myselfData.refresh().flatMap(() => {
          this.myselfData.hasSignedIn().then(
            hasSignedIn => {
              if(hasSignedIn) {
                return super.request(apiUrl, requestOptions);
              } else {
                return Observable.throw(new Error("Can't refresh the token"));
              }
            }
          );
        });
      } else {
        return Observable.throw(error);
      }
    });
   }
}
