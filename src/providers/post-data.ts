import { Injectable } from '@angular/core';
import { Headers } from "@angular/http";
import { RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { ApiHttp } from '../providers/api-http';
import { Post } from '../models/post';
import { Parti } from '../models/parti';
import { User } from '../models/user';
import { InfinitePage } from '../models/infinite-page';

@Injectable()
export class PostData {
  constructor(
    private http: ApiHttp
  ) {}

  dashboardAfter(lastPost: Post = null): Observable<InfinitePage<Post>> {
    let requestOptions = new RequestOptions();
    let searchParams = new URLSearchParams();
    if(!!lastPost) {
      searchParams.set('last_id', String(lastPost.id));
      requestOptions.search = searchParams;
    }
    return this.http.get('/api/v1/posts/dashboard_after', requestOptions)
      .map(res => <InfinitePage<Post>>(res.json()));
  }

  dashboardLatest(firstPost: Post = null): Observable<InfinitePage<Post>> {
    let requestOptions = new RequestOptions();
    let searchParams = new URLSearchParams();
    if(!!firstPost) {
      searchParams.set('first_id', String(firstPost.id));
      requestOptions.search = searchParams;
    }
    return this.http.get('/api/v1/posts/dashboard_latest', requestOptions)
      .map(res => <InfinitePage<Post>>(res.json()));
  }

  parti(parti: Parti, lastPost: Post = null): Observable<InfinitePage<Post>> {
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
      .map(res => <InfinitePage<Post>>(res.json()));
  }

  byUser(user: User, lastPost: Post = null): Observable<InfinitePage<Post>> {
    let requestOptions = new RequestOptions();
    let searchParams = new URLSearchParams();
    searchParams.set('user_id', String(user.id));
    if(lastPost) {
      searchParams.set('last_id', String(lastPost.id));
    }
    requestOptions.search = searchParams;
    return this.http.get(`/api/v1/posts/by_user`, requestOptions)
      .map(res => <InfinitePage<Post>>(res.json()));
  }

  get(id: number): Observable<Post> {
    return this.http.get(`/api/v1/posts/${id}`)
      .map(res => <Post>(res.json().post));
  }

  newPostsCount(lastTouchedAt: string): Observable<number> {
    let requestOptions = new RequestOptions();
    let searchParams = new URLSearchParams();
    searchParams.set('last_touched_at', lastTouchedAt);
    requestOptions.search = searchParams;

    return this.http.get(`/api/v1/posts/new_count`, requestOptions)
      .map(res => <number>(res.json().posts_count));
  }

  create(parti: Parti, body: string,
    attachment: string, link: string, poll: string
  ): Observable<Post> {
    let requestOptions = new RequestOptions();

    let formData: FormData = new FormData();
    if(!!attachment) {
      formData.append('post[reference][attachment]', attachment);
    }
    if(!!link) {
      formData.append('post[reference][link]', link);
    }
    if(!!poll) {
      formData.append('post[reference][poll]', poll);
    }
    formData.append('post[parti_id]', parti.id);
    formData.append('post[body]', body);
    requestOptions.body = formData;

    let headers = new Headers();
    headers.append('Content-Type', 'multipart/form-data');
    requestOptions.headers = headers;

    return this.http.post('/api/v1/posts', requestOptions)
      .map(res => <Post>(res.json().post));
  }
}
