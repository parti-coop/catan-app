import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { ApiHttp } from '../providers/api-http'
import { Parti } from '../models/parti'

@Injectable()
export class InvitationData {
  constructor(
    private http: ApiHttp
  ) {}

  inviteEmails(parti: Parti, emails: string[]): Observable<void> {
    let requestOptions = new RequestOptions();
    requestOptions.body = JSON.stringify({
      emails: emails,
      parti_id: parti.id
    });
    return this.http.post(`/api/v1/invitations/by_emails`, requestOptions)
      .map(res => {});
  }

  inviteNicknames(parti: Parti, nicknames: string[]): Observable<void> {
    let requestOptions = new RequestOptions();
    requestOptions.body = JSON.stringify({
      nicknames: nicknames,
      parti_id: parti.id
    });
    return this.http.post(`/api/v1/invitations/by_nicknames`, requestOptions)
      .map(res => {});
  }
}
