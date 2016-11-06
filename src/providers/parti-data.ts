import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { ApiHttp } from '../providers/api-http'
import { Parti } from '../models/parti'

@Injectable()
export class PartiData {
  constructor(
    private http: ApiHttp
  ) {}

  joinedOnly(): Observable<Parti[]> {
    return this.http.get('/api/v1/parties/joined_only')
      .map(res => <Parti[]>(res.json().parties));
  }

  making(): Observable<Parti[]> {
    return this.http.get('/api/v1/parties/making')
      .map(res => <Parti[]>(res.json().parties));
  }

  all(): Observable<Parti[]> {
    return this.http.get('/api/v1/parties')
      .map(res => <Parti[]>(res.json().parties));
  }

  first(): Observable<Parti> {
    return this.http.get('/api/v1/parties/first')
      .map(res => <Parti>(res.json().parti));
  }
}
