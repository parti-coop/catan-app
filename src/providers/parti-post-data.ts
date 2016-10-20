import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

// import { Http, Headers, RequestOptions } from '@angular/http';
import { ApiHttp } from '../providers/api-http'
import { PartiPost } from '../models/parti-post'

@Injectable()
export class PartiPostData {
  constructor(private http: ApiHttp) {
    console.log("PartiPostData!!!!")
  }

  dashboard(): Observable<PartiPost[]> {
    return this.http.get('/api/v1/dashboard/posts')
      .map(res => <PartiPost[]>(res.json().posts));
  }
}
