import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { Events, AlertController } from 'ionic-angular';
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
    private alertCtrl: AlertController,
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
    } else if(options.headers.get('Content-Type') && options.headers.get('Content-Type') == 'multipart/form-data') {
      options.headers.delete('Content-Type');
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
            if(succeed) {
              requestOptions = this.getRequestOption(method, url, options);
              return this.http.request(apiUrl, requestOptions);
            } else {
              if(usedSessionStamp != this.sessionStamp) {
                console.log("ApiHttp#intercept : old session");
                return Observable.empty();
              }
              this.sessionStamp = new Date();
              this.events.publish('refreshToken:fail');
              return Observable.throw(error);
            }
          }).catch((error) => {
            return this.handleError(error, usedSessionStamp);
          });
      } else {
        return this.handleError(error, usedSessionStamp);
      }
    });
   }

   handleError(error, usedSessionStamp) {
      if (error && error.status  == 404) {
        let alert = this.alertCtrl.create({
          title: '안내',
          subTitle: '지워지거나 없는 정보입니다.',
          buttons: ['확인']
        });
        alert.present();
        return Observable.throw(error);
      } else {
        if(usedSessionStamp != this.sessionStamp) {
          console.log("ApiHttp#handleError : old session");
          return Observable.empty();
        }

        this.sessionStamp = new Date();
        console.log("ApiHttps#handleError : error - " + JSON.stringify(error));

        let alert = this.alertCtrl.create({
          title: '오류',
          subTitle: '죄송합니다. 뭔가 잘못되었습니다.',
          buttons: ['확인']
        });
        alert.present();
        return Observable.throw(error);
      }
   }
}
