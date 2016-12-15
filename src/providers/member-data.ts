import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import { ApiHttp } from '../providers/api-http'
import { Parti } from '../models/parti'

@Injectable()
export class MemberData {
  constructor(
    private http: ApiHttp
  ) {}

  join(parti: Parti): Observable<void> {
    let requestOptions = new RequestOptions();

    if(!!parti.group) {
      let searchParams = new URLSearchParams();
      searchParams.set('group_slug', String(parti.group.slug));
      requestOptions.search = searchParams;
    }

    return this.http.post(`/api/v1/parties/${parti.slug}/members`, requestOptions)
      .map(res => {});
  }

  cancel(parti: Parti): Observable<void> {
    let requestOptions = new RequestOptions();

    if(!!parti.group) {
      let searchParams = new URLSearchParams();
      searchParams.set('group_slug', String(parti.group.slug));
      requestOptions.search = searchParams;
    }

    return this.http.delete(`/api/v1/parties/${parti.slug}/members`, requestOptions)
      .map(res => {});
  }

}
