import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { RequestOptions, URLSearchParams } from '@angular/http';
import { ApiHttp } from '../providers/api-http'

@Injectable()
export class TagData {
  constructor(
    private http: ApiHttp
  ) {}

  mostUsedOnParties(limit: number = 100): Observable<string[]> {
    let searchParams = new URLSearchParams();
    searchParams.set('limit', String(limit));

    let requestOptions = new RequestOptions();
    requestOptions.search = searchParams;

    return this.http.get('/api/v1/tags/most_used_on_parties', requestOptions)
      .map(res => <string[]>(res.json().tags));
  }
}
