import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { RequestOptions, Response, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import { ApiHttp } from '../providers/api-http';

import { Poll } from '../models/poll';
import { Voting } from '../models/voting';
import { InfinitePage } from '../models/infinite-page';

@Injectable()
export class VotingData {
  constructor(
    private http: ApiHttp
  ) {}

  choose(poll_id: number, choice: string): Observable<Response> {
    let requestOptions = new RequestOptions();
    requestOptions.body = JSON.stringify({
      voting: {
        poll_id: poll_id,
        choice: choice
      }
    });
    return this.http.post('/api/v1/votings', requestOptions);
  }

  agreesOfPoll(poll: Poll, lastVoting: Voting = null): Observable<InfinitePage<Voting>> {
    let requestOptions = new RequestOptions();
    let searchParams = new URLSearchParams();
    searchParams.set('poll_id', String(poll.id));
    if(!!lastVoting) {
      searchParams.set('last_id', String(lastVoting.id));
    }
    requestOptions.search = searchParams;

    return this.http.get('/api/v1/votings/agrees_of_poll', requestOptions)
      .map(req => <InfinitePage<Voting>>(req.json()));
  }

  disagreesOfPoll(poll: Poll, lastVoting: Voting = null): Observable<InfinitePage<Voting>> {
    let requestOptions = new RequestOptions();
    let searchParams = new URLSearchParams();
    searchParams.set('poll_id', String(poll.id));
    if(!!lastVoting) {
      searchParams.set('last_id', String(lastVoting.id));
    }
    requestOptions.search = searchParams;

    return this.http.get('/api/v1/votings/disagrees_of_poll', requestOptions)
      .map(req => <InfinitePage<Voting>>(req.json()));
  }
}
