import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Platform, AlertController } from 'ionic-angular';
import { NativeStorage } from 'ionic-native';

import { AuthToken } from '../models/auth-token';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Injectable()
export class MyselfData {
  apiBaseUrl = 'http://parti.dev';
  STORAGE_REFERENCE_HAS_SIGNED_IN = 'MyselfData_hasSignedIn';
  STORAGE_REFERENCE_NICKNAME = 'MyselfData_nickname';
  STORAGE_REFERENCE_ACCESS_TOKEN = 'MyselfData_accessToken';
  STORAGE_REFERENCE_REFRESH_TOKEN = 'MyselfData_refreshToken';

  public accessToken: string;
  public refreshToken: string;
  public nickname: string;
  private readyToAuth: boolean;
  private _hasSignedIn: boolean;

  constructor(
    private platform: Platform,
    public http: Http,
    private alertCtrl: AlertController
  ) {
    this.readyToAuth = false;

    this.platform.ready().then(() => {
      Promise.all([
        NativeStorage.getItem(this.STORAGE_REFERENCE_HAS_SIGNED_IN),
        NativeStorage.getItem(this.STORAGE_REFERENCE_NICKNAME),
        NativeStorage.getItem(this.STORAGE_REFERENCE_ACCESS_TOKEN),
        NativeStorage.getItem(this.STORAGE_REFERENCE_REFRESH_TOKEN)
      ]).then(values => {
        this._hasSignedIn = values[0];
        this.nickname = values[1];
        this.accessToken = values[2];
        this.refreshToken = values[3];
        this.readyToAuth = true;
      }).catch(error => {
        console.log("MyselfData Init");
        console.log(error);
        this._hasSignedIn = false;
      });
    });
  }

  auth(snsProvider, snsAccessToken) {
    let body = {
      provider: snsProvider,
      assertion: snsAccessToken,
      grant_type: 'assertion',
      client_id: '48549c7c03f1a479c6702e1b5993742b013f2e99ea551e8f90450559e24b388a',
      client_secret: '2cef1a05f43abcead6c92605373b585e1b6d8dc539e9c3bfab41911f06f16bd9'
    };
    return this.http.post(`${this.apiBaseUrl}/oauth/token`, body)
      .map(res => <AuthToken>res.json())
      .toPromise()
      .then(response => {
        return this.storeSignedInData(response.access_token, response.refresh_token, 'test nick');
      }).catch((error) => {
        alert(error);
        throw error;
      });
  }

  storeSignedInData(accessToken, refreshToken, nickname) {
    Promise.all([
      NativeStorage.setItem(this.STORAGE_REFERENCE_HAS_SIGNED_IN, true),
      NativeStorage.setItem(this.STORAGE_REFERENCE_NICKNAME, nickname),
      NativeStorage.setItem(this.STORAGE_REFERENCE_ACCESS_TOKEN, accessToken),
      NativeStorage.setItem(this.STORAGE_REFERENCE_REFRESH_TOKEN, refreshToken)
    ]).then(values => {
      this._hasSignedIn = true;
      this.nickname = nickname;
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
    }).catch(error => {
      console.log(error);
    });
  }

  // Return a promise. This method sould be called after platform reday
  hasSignedIn() {
    if(this.readyToAuth) {
      return Promise.resolve(this._hasSignedIn);
    }

    return NativeStorage.getItem(this.STORAGE_REFERENCE_HAS_SIGNED_IN).catch(error => {
      return Promise.resolve(false);
    });
  }

}
