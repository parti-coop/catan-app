import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { Events } from 'ionic-angular';
import { RequestOptions, RequestMethod, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { PartiEnvironment } from '../config/constant';
import { MyselfData } from '../providers/myself-data';

@Injectable()
export class ApiHttp {
  sessionStamp: Date;

  constructor(
    private myselfData: MyselfData,
    private partiEnvironment: PartiEnvironment,
    private events: Events,
    private http: Http
  ) {
    this.sessionStamp = new Date();
  }

  public request(method: RequestMethod, url: string, options?: RequestOptions): Observable<Response> {
    return this.intercept(method, url, options);
  }

  public get(url: string, options?: RequestOptions): Observable<Response> {
    return this.intercept(RequestMethod.Get, url, options);
  }

  public post(url: string, options?: RequestOptions): Observable<Response> {
    return this.intercept(RequestMethod.Post, url, options);
  }

  public put(url: string, options?: RequestOptions): Observable<Response> {
    return this.intercept(RequestMethod.Put, url, options);
  }

  public delete(url: string, options?: RequestOptions): Observable<Response> {
    return this.intercept(RequestMethod.Delete, url, options);
  }

  public patch(url: string, options?: RequestOptions): Observable<Response> {
    return this.intercept(RequestMethod.Patch, url, options);
  }

  public head(url: string, options?: RequestOptions): Observable<Response> {
    return this.intercept(RequestMethod.Head, url, options);
  }

  getRequestOption(method: RequestMethod, url: string, options?: RequestOptions): RequestOptions {
    if (options == null) {
      options = new RequestOptions();
    }
    if (options.headers == null) {
      options.headers = new Headers();
    }
    if (this.myselfData.accessToken) {
      options.headers.delete('Authorization');
      options.headers.append('Authorization', `Bearer ${this.myselfData.accessToken}`);
    }
    if (!options.headers.get('Content-Type') || !options.headers.get('Content-Type').length) {
      options.headers.append('Content-Type', 'application/json');
    }
    options.method = method;
    return options;
  }

  intercept(method: RequestMethod, url: string, options?: RequestOptions): Observable<Response> {
    var requestOptions: RequestOptions = this.getRequestOption(method, url, options);
    let apiUrl = `${this.partiEnvironment.apiBaseUrl}${url}`;
    let usedSessionStamp = this.sessionStamp;

    return this.http.request(apiUrl, requestOptions).catch((error, source) => {
      if (error && error.status  == 401) {
        return this.myselfData.refresh()
          .mergeMap(succeed => {
            requestOptions = this.getRequestOption(method, url, options);
            return this.http.request(apiUrl, requestOptions);
          }).catch(error => {
            if(usedSessionStamp != this.sessionStamp) {
              console.log("ApiHttp#intercept : old session");
              return Observable.empty();
            }

            this.sessionStamp = new Date();
            if(this.myselfData.hasSignedIn) {
              this.events.publish('user:signError');
              return Observable.throw(new Error("Can't refresh the token"));
            } else {
              this.events.publish('user:signOut');
              console.log("ApiHttp#intercept : signout out!");
              return Observable.empty();
            }
          });
      } else {
        if(usedSessionStamp != this.sessionStamp) {
          console.log("ApiHttp#intercept : old session");
          return Observable.empty();
        }

        this.sessionStamp = new Date();
        console.log("ApiHttps#intercept : error - " + JSON.stringify(error));
        this.events.publish('app:error', error);
        return Observable.throw(error);
      }
    });
   }
}
