import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { RequestOptions, URLSearchParams } from '@angular/http';
import { ApiHttp } from '../providers/api-http'
import { User } from '../models/user'

@Injectable()
export class UserData {
  constructor(
    private http: ApiHttp
  ) {}

  byNickname(nickname: string): Observable<User> {
    let searchParams = new URLSearchParams();
    searchParams.set('nickname', nickname);

    let requestOptions = new RequestOptions();
    requestOptions.search = searchParams;

    return this.http.get('/api/v1/users/by_nickname', requestOptions)
      .map(res => <User>(res.json().user));
  }

  bySlug(slug: string): Observable<User> {
    let searchParams = new URLSearchParams();
    searchParams.set('slug', slug);

    let requestOptions = new RequestOptions();
    requestOptions.search = searchParams;

    return this.http.get('/api/v1/users/by_slug', requestOptions)
      .map(res => <User>(res.json().user));
  }
}
