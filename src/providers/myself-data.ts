import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Platform } from 'ionic-angular';
import { NativeStorage } from 'ionic-native';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';
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
  private syncedStorage: boolean = false;
  private _hasSignedIn: boolean = false;

  constructor(
    private platform: Platform,
    private http: Http,
    private partiEnvironment: PartiEnvironment
  ) {
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
        this.syncedStorage = true;
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

  auth(snsProvider: string, snsAccessToken: string,  snsSecretToken: string = '') {
    let tokenRequestBody = {
      provider: snsProvider,
      assertion: snsAccessToken,
      secret: snsSecretToken,
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
      }).mergeMap(myself => {
        return this.storeMyselfData(myself);
      }).mergeMap(() => {
        return this.storeHasSignedIn(true);
      }).catch((error) => {
        console.log("MyselfData#auth : " + error);
        return this.storeHasSignedIn(false)
          .map(() => {
            throw error
          });
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

  storeMyselfData(myself: Myself) {
    return Observable.from(Promise.all([
      NativeStorage.setItem(this.STORAGE_REFERENCE_ID, myself.id),
      NativeStorage.setItem(this.STORAGE_REFERENCE_NICKNAME, myself.nickname),
      NativeStorage.setItem(this.STORAGE_REFERENCE_IMAGE_URL, myself.image_url)])
      .then(values => {
        this.id = myself.id;
        this.nickname = myself.nickname;
        this.imageUrl = myself.image_url;
      }));
  }

  clearMyselfData() {
    return Observable.from(Promise.all([
        NativeStorage.remove(this.STORAGE_REFERENCE_HAS_SIGNED_IN),
        NativeStorage.remove(this.STORAGE_REFERENCE_NICKNAME),
        NativeStorage.remove(this.STORAGE_REFERENCE_ID),
        NativeStorage.remove(this.STORAGE_REFERENCE_ACCESS_TOKEN),
        NativeStorage.remove(this.STORAGE_REFERENCE_REFRESH_TOKEN)
      ]).then(values => {
        this.accessToken = null;
        this.refreshToken = null;
        this.nickname = null;
        this.id = -1;
        this.imageUrl = null;
        this._hasSignedIn = false;
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
    if(this.syncedStorage) {
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
      .mergeMap(authToken => {
        return this.storeTokenData(authToken.access_token, authToken.refresh_token);
      }).mergeMap(accessToken => {
        let meRequestOptions = new RequestOptions({headers: new Headers({ 'Authorization': `Bearer ${accessToken}` })});
        return this.http.get(`${this.partiEnvironment.apiBaseUrl}/api/v1/users/me`, meRequestOptions)
                   .map(res => <Myself>res.json().user);
      }).mergeMap(myself => {
        return this.storeMyselfData(myself);
      }).map(() => {
        this._hasSignedIn = true;
        return this._hasSignedIn;
      }).catch((error) => {
        this._hasSignedIn = false;
        console.log("MyselfData#refresh : " + error);
        throw error;
      });
  }

  signOut() {
    let tokenRequestBody = {
      token: this.accessToken,
      client_id: this.partiEnvironment.apiClientId,
      client_secret: this.partiEnvironment.apiClientSecret
    };
    return this.http.post(`${this.partiEnvironment.apiBaseUrl}/oauth/revoke`, tokenRequestBody)
      .mergeMap(response => {
        this.syncedStorage = false;
        return this.clearMyselfData().finally(() => {
          this.syncedStorage = true;
        });
      }).catch((error) => {
        console.log("MyselfData#signOut : " + error);
        throw error;
      });
  }

  asModel(): Myself {
    return <Myself>{id: this.id, nickname: this.nickname, image_url: this.imageUrl};
  }

}
