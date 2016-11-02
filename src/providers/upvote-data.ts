import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { RequestMethod, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';

import { ApiHttp } from '../providers/api-http'

@Injectable()
export class UpvoteData {
  constructor(
    private http: ApiHttp
  ) {}

  create(upvotable_id: number, upvotable_type: string): Observable<Response> {
    return this.run(RequestMethod.Post, upvotable_id, upvotable_type);
  }

  destroy(upvotable_id: number, upvotable_type: string): Observable<Response> {
    return this.run(RequestMethod.Delete, upvotable_id, upvotable_type);
  }

  private run(method: RequestMethod, upvotable_id: number, upvotable_type: string) {
    let requestOptions = new RequestOptions();
    requestOptions.body = JSON.stringify({
      upvote: {
        upvotable_type: upvotable_type,
        upvotable_id: upvotable_id
      }
    });
    return this.http.request(method, '/api/v1/upvotes', requestOptions);
  }
}
