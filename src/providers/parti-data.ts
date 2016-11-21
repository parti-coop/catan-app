import { Injectable } from '@angular/core';
import { RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { ApiHttp } from '../providers/api-http'
import { Parti } from '../models/parti'

@Injectable()
export class PartiData {
  constructor(
    private http: ApiHttp
  ) {}

  joinedOnly(): Observable<Parti[]> {
    return this.http.get('/api/v1/parties/joined_only')
      .map(res => <Parti[]>(res.json().parties));
  }

  joined(): Observable<Parti[]> {
    return this.http.get('/api/v1/parties/joined')
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


  get(slug: string): Observable<Parti> {
    return this.http.get(`/api/v1/parties/${slug}`)
      .map(res => <Parti>(res.json().parti));
  }

  first(): Observable<Parti> {
    return this.http.get('/api/v1/parties/first')
      .map(res => <Parti>(res.json().parti));
  }
}
