import { Injectable } from '@angular/core';
import { RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { ApiHttp } from '../providers/api-http';
import { Parti } from '../models/parti';
import { User } from '../models/user';

@Injectable()
export class PartiData {
  constructor(
    private http: ApiHttp
  ) {}

  joinedOnly(): Observable<Parti[]> {
    return this.http.get('/api/v1/parties/joined_only')
      .map(res => <Parti[]>(res.json().parties));
  }

  joined(user: User): Observable<Parti[]> {
    let requestOptions = new RequestOptions();
    if(!!user) {
      let searchParams = new URLSearchParams();
      searchParams.set('user_id', String(user.id));
      requestOptions.search = searchParams;
    }
    return this.http.get('/api/v1/parties/joined', requestOptions)
      .map(res => <Parti[]>(res.json().parties));
  }

  making(): Observable<Parti[]> {
    return this.http.get('/api/v1/parties/making')
      .map(res => <Parti[]>(res.json().parties));
  }

  all(): Observable<Parti[]> {
    return this.http.get('/api/v1/parties')
      .map(res => <Parti[]>(res.json().parties));
  }

  on_group(group_slug: string): Observable<Parti[]> {
    return this.http.get(`/api/v1/groups/${group_slug}/parties`)
      .map(res => <Parti[]>(res.json().parties));
  }

  tagged(tagNames): Observable<Parti[]> {
    let searchParams = new URLSearchParams();
    searchParams.set('tags', tagNames.join());
    let requestOptions = new RequestOptions();
    requestOptions.search = searchParams;

    return this.http.get('/api/v1/parties/tagged', requestOptions)
      .map(res => <Parti[]>(res.json().parties));
  }

  get(slug: string, group_slug: string): Observable<Parti> {
    let requestOptions = new RequestOptions();

    if(!!group_slug) {
      let searchParams = new URLSearchParams();
      searchParams.set('group_slug', String(group_slug));
      requestOptions.search = searchParams;
    }

    return this.http.get(`/api/v1/parties/${slug}`, requestOptions)
      .map(res => <Parti>(res.json().parti));
  }
}
