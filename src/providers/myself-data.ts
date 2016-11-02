import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Platform } from 'ionic-angular';
import { NativeStorage } from 'ionic-native';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/from';

import { AuthToken } from '../models/auth-token';
import { Myself } from '../models/myself';
import { PartiEnvironment } from '../config/constant';

@Injectable()
export class MyselfData {
  STORAGE_REFERENCE_HAS_SIGNED_IN = 'MyselfData_hasSignedIn';
  STORAGE_REFERENCE_NICKNAME = 'MyselfData_nickname';
  STORAGE_REFERENCE_ID = 'MyselfData_id';
  STORAGE_REFERENCE_IMAGE_URL = 'MyselfData_imageUrl';
  STORAGE_REFERENCE_ACCESS_TOKEN = 'MyselfData_accessToken';
  STORAGE_REFERENCE_REFRESH_TOKEN = 'MyselfData_refreshToken';

  public accessToken: string;
  public refreshToken: string;
  public nickname: string;
  public id: number;
  public imageUrl: string;
  private readyToAuth: boolean;
  private _hasSignedIn: boolean;

  constructor(
    private platform: Platform,
    private http: Http,
    private partiEnvironment: PartiEnvironment
  ) {
    this.readyToAuth = false;

    this.platform.ready().then(() => {
      Promise.all([
        NativeStorage.getItem(this.STORAGE_REFERENCE_HAS_SIGNED_IN),
        NativeStorage.getItem(this.STORAGE_REFERENCE_NICKNAME),
        NativeStorage.getItem(this.STORAGE_REFERENCE_ID),
        NativeStorage.getItem(this.STORAGE_REFERENCE_ACCESS_TOKEN),
        NativeStorage.getItem(this.STORAGE_REFERENCE_REFRESH_TOKEN)
      ]).then(values => {
        this._hasSignedIn = values[0];
        this.nickname = values[1];
        this.id = values[2];
        this.accessToken = values[3];
        this.refreshToken = values[4];
        this.readyToAuth = true;
        if(this._hasSignedIn) {
          console.log("MyselfData : 이미 로그인");
        } else {
          console.log("MyselfData : 로그아웃");
        }
      }).catch(error => {
        console.log("MyselfData : 로그인 정보 없음");
        console.log(JSON.stringify(error));
        this._hasSignedIn = false;
      });
    });
  }

  auth(snsProvider: string, snsAccessToken: string) {
    let tokenRequestBody = {
      provider: snsProvider,
      assertion: snsAccessToken,
      grant_type: 'assertion',
      client_id: this.partiEnvironment.apiClientId,
      client_secret: this.partiEnvironment.apiClientSecret
    };
    return this.http.post(`${this.partiEnvironment.apiBaseUrl}/oauth/token`, tokenRequestBody)
      .map(res => <AuthToken>res.json())
      .mergeMap(response => {
        return this.storeTokenData(response.access_token, response.refresh_token);
      }).mergeMap(accessToken => {
        let meRequestOptions = new RequestOptions({headers: new Headers({ 'Authorization': `Bearer ${accessToken}` })});
        return this.http.get(`${this.partiEnvironment.apiBaseUrl}/api/v1/users/me`, meRequestOptions)
                   .map(res => <Myself>res.json().user);
      }).mergeMap(response => {
        return this.storeMyselfData(response.id, response.nickname, response.image_url);
      }).mergeMap(() => {
        return this.storeHasSignedIn(true)
      }).catch((error) => {
        console.log("MyselfData#auth : " + error);
        return this.storeHasSignedIn(false)
          .map(() => {throw error});
      });
  }

  storeTokenData(accessToken, refreshToken) {
    return Observable.from(Promise.all([
      NativeStorage.setItem(this.STORAGE_REFERENCE_ACCESS_TOKEN, accessToken),
      NativeStorage.setItem(this.STORAGE_REFERENCE_REFRESH_TOKEN, refreshToken)])
      .then(values => {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        return accessToken
      }));
  }

  storeMyselfData(id, nickname, imageUrl) {
    return Observable.from(Promise.all([
      NativeStorage.setItem(this.STORAGE_REFERENCE_ID, id),
      NativeStorage.setItem(this.STORAGE_REFERENCE_NICKNAME, nickname),
      NativeStorage.setItem(this.STORAGE_REFERENCE_IMAGE_URL, imageUrl)])
      .then(values => {
        this.id = id;
        this.nickname = nickname;
        this.imageUrl = imageUrl;
      }));
  }

  storeHasSignedIn(hasSignedIn) {
    return Observable.from(NativeStorage.setItem(this.STORAGE_REFERENCE_HAS_SIGNED_IN, hasSignedIn)
      .then(value => {
        this._hasSignedIn = value;
      }));
  }

  // Return a promise. This method sould be called after platform reday
  hasSignedIn() {
    if(this.readyToAuth) {
      return Promise.resolve(this._hasSignedIn);
    }
    return NativeStorage.getItem(this.STORAGE_REFERENCE_HAS_SIGNED_IN)
      .catch(error => {
        return Promise.resolve(false);
      });
  }

  refresh(): Observable<boolean> {
    this._hasSignedIn = false;
    let tokenRequestBody = {
      refresh_token: this.refreshToken,
      grant_type: 'refresh_token',
      client_id: this.partiEnvironment.apiClientId,
      client_secret: this.partiEnvironment.apiClientSecret
    };
    console.log("MyselfData#refresh : Starting refresh-token");
    return this.http.post(`${this.partiEnvironment.apiBaseUrl}/oauth/token`, tokenRequestBody)
      .map(res => <AuthToken>res.json())
      .mergeMap(response => {
        return this.storeTokenData(response.access_token, response.refresh_token);
      }).mergeMap(accessToken => {
        let meRequestOptions = new RequestOptions({headers: new Headers({ 'Authorization': `Bearer ${accessToken}` })});
        return this.http.get(`${this.partiEnvironment.apiBaseUrl}/api/v1/users/me`, meRequestOptions)
                   .map(res => <Myself>res.json().user);
      }).mergeMap(myself => {
        return this.storeMyselfData(myself.id, myself.nickname, myself.image_url);
      }).map(() => {
        this._hasSignedIn = true;
        return this._hasSignedIn;
      }).catch((error) => {
        this._hasSignedIn = false;
        console.log("MyselfData#refresh : " + error);
        throw error;
      });
  }

  asModel(): Myself {
    return <Myself>{id: this.id, nickname: this.nickname, image_url: this.imageUrl};
  }

}
