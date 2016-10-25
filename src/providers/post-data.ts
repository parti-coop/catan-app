import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

// import { Http, Headers, RequestOptions } from '@angular/http';
import { ApiHttp } from '../providers/api-http'
import { Post } from '../models/post'

@Injectable()
export class PostData {
  constructor(
    private http: ApiHttp
  ) {}

  dashboard(): Observable<Post[]> {
    return this.http.get('/api/v1/dashboard/posts')
      .map(res => <Post[]>(res.json().posts));
  }
}
