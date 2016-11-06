import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { RequestOptions, URLSearchParams } from '@angular/http';
import { ApiHttp } from '../providers/api-http'
import { Post } from '../models/post'
import { Parti } from '../models/parti'
import { InfinitPage } from '../models/infinit-page'

@Injectable()
export class PostData {
  constructor(
    private http: ApiHttp
  ) {}

  dashboard(lastPost: Post = null): Observable<InfinitPage<Post>> {
    let requestOptions = new RequestOptions();
    let searchParams = new URLSearchParams();
    if(lastPost) {
      searchParams.set('last_id', String(lastPost.id));
      requestOptions.search = searchParams;
    }
    return this.http.get('/api/v1/dashboard/posts', requestOptions)
      .map(res => <InfinitPage<Post>>(res.json()));
  }

  parti(parti: Parti, lastPost: Post = null): Observable<InfinitPage<Post>> {
    let requestOptions = new RequestOptions();
    let searchParams = new URLSearchParams();
    if(lastPost) {
      searchParams.set('last_id', String(lastPost.id));
      requestOptions.search = searchParams;
    }
    return this.http.get(`/api/v1/parties/${parti.slug}/posts`, requestOptions)
      .map(res => <InfinitPage<Post>>(res.json()));
  }
}
