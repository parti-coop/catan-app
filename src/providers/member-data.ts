import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { ApiHttp } from '../providers/api-http'
import { Parti } from '../models/parti'
import { Member } from '../models/member'

@Injectable()
export class MemberData {
  constructor(
    private http: ApiHttp
  ) {}

  join(parti: Parti): Observable<void> {
    return this.http.post(`/api/v1/parties/${parti.slug}/members`)
      .map(res => {});
  }

  cancel(parti: Parti): Observable<void> {
    return this.http.delete(`/api/v1/parties/${parti.slug}/members`)
      .map(res => {});
  }

  allOfParti(parti: Parti): Observable<Member[]> {
    return this.http.get(`/api/v1/parties/${parti.slug}/members`)
      .map(res => <Member[]>(res.json().members));
  }
}
