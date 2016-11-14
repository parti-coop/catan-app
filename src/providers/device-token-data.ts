import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { ApiHttp } from '../providers/api-http'

@Injectable()
export class DeviceTokenData {
  constructor(
    private http: ApiHttp
  ) {}

  register(registrationId: string): Observable<void> {
    let requestOptions = new RequestOptions();
    requestOptions.body = JSON.stringify({
      registration_id: registrationId
    });
    return this.http.post('/api/v1/device_tokens', requestOptions)
      .map(res => {});
  }

  unregister(registrationId: string): Observable<void> {
    let requestOptions = new RequestOptions();
    requestOptions.body = JSON.stringify({
      registration_id: registrationId
    });
    return this.http.delete('/api/v1/device_tokens', requestOptions)
      .map(res => {});
  }
}
