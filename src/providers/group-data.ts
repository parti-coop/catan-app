import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { ApiHttp } from '../providers/api-http'
import { Group } from '../models/group'

@Injectable()
export class GroupData {
  constructor(
    private http: ApiHttp
  ) {}

  joined(): Observable<Group[]> {
    return this.http.get('/api/v1/groups/joined')
      .map(res => <Group[]>(res.json().groups));
  }
}
