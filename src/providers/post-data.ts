import { Injectable } from '@angular/core';
import { RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { ApiHttp } from '../providers/api-http';
import { Post } from '../models/post';
import { Parti } from '../models/parti';
import { User } from '../models/user';
import { InfinitPage } from '../models/infinit-page';

@Injectable()
export class PostData {
  constructor(
    private http: ApiHttp
  ) {}

  dashboard(lastPost: Post = null): Observable<InfinitPage<Post>> {
    let requestOptions = new RequestOptions();
    let searchParams = new URLSearchParams();
    if(!!lastPost) {
      searchParams.set('last_id', String(lastPost.id));
      requestOptions.search = searchParams;
    }
    return this.http.get('/api/v1/posts/dashboard', requestOptions)
      .map(res => <InfinitPage<Post>>(res.json()));
  }

  parti(parti: Parti, lastPost: Post = null): Observable<InfinitPage<Post>> {
    let requestOptions = new RequestOptions();
    let searchParams = new URLSearchParams();
    if(!!lastPost) {
      searchParams.set('last_id', String(lastPost.id));
    }
    if(!!parti.group) {
      searchParams.set('group_slug', parti.group.slug);
    }
    requestOptions.search = searchParams;
    return this.http.get(`/api/v1/parties/${parti.slug}/posts`, requestOptions)
      .map(res => <InfinitPage<Post>>(res.json()));
  }

  byUser(user: User, lastPost: Post = null): Observable<InfinitPage<Post>> {
    let requestOptions = new RequestOptions();
    let searchParams = new URLSearchParams();
    searchParams.set('user_id', String(user.id));
    if(lastPost) {
      searchParams.set('last_id', String(lastPost.id));
    }
    requestOptions.search = searchParams;
    return this.http.get(`/api/v1/posts/by_user`, requestOptions)
      .map(res => <InfinitPage<Post>>(res.json()));
  }

  get(id: number): Observable<Post> {
    return this.http.get(`/api/v1/posts/${id}`)
      .map(res => <Post>(res.json().post));
  }
}
