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

  watchedParties(): Observable<Parti[]> {
    return this.http.get('/api/v1/parties/watched')
      .map(res => <Parti[]>(res.json().parties));
  }
}
