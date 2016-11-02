import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';

import { ApiHttp } from '../providers/api-http'

@Injectable()
export class VotingData {
  constructor(
    private http: ApiHttp
  ) {}

  choose(poll_id: number, choice: string): Observable<Response> {
    let requestOptions = new RequestOptions();
    requestOptions.body = JSON.stringify({
      voting: {
        poll_id: poll_id,
        choice: choice
      }
    });
    return this.http.post('/api/v1/votings', requestOptions);
  }
}
