import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';

import { ApiHttp } from '../providers/api-http'

@Injectable()
export class UpvoteData {
  constructor(
    private http: ApiHttp
  ) {}

  create(upvotable_id: number, upvotable_type: string): Observable<Response> {
    let requestOptions = new RequestOptions();
    requestOptions.body = JSON.stringify({
      upvote: {
        upvotable_type: upvotable_type,
        upvotable_id: upvotable_id
      }
    });
    return this.http.post('/api/v1/upvotes', requestOptions);
  }

  destroy(upvotable_id: number, upvotable_type: string): Observable<Response> {
    let requestOptions = new RequestOptions();
    requestOptions.body = JSON.stringify({
      upvote: {
        upvotable_type: upvotable_type,
        upvotable_id: upvotable_id
      }
    });
    return this.http.delete('/api/v1/upvotes', requestOptions);
  }
}
