import { Injectable } from '@angular/core';
import { RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';

import { ApiHttp } from '../providers/api-http'
import { Message } from '../models/message'
import { InfinitPage } from '../models/infinit-page'

@Injectable()
export class MessageData {
  constructor(
    private http: ApiHttp
  ) {}

  inbox(lastMessage: Message = null): Observable<InfinitPage<Message>> {
    let requestOptions = new RequestOptions();
    let searchParams = new URLSearchParams();
    if(!!lastMessage) {
      searchParams.set('last_id', String(lastMessage.id));
    }
    requestOptions.search = searchParams;

    return this.http.get('/api/v1/messages', requestOptions)
      .map(req => <InfinitPage<Message>>(req.json()));
  }

  touchReadAt(message: Message): Observable<void> {
    return this.http.patch(`/api/v1/messages/${message.id}/touch_read_at`)
      .map(req => {});
  }

  newCount(messageId: number): Observable<number> {
    let requestOptions = new RequestOptions();
    let searchParams = new URLSearchParams();
    searchParams.set('last_id', String(messageId));
    requestOptions.search = searchParams;

    return this.http.get(`/api/v1/messages/new_count`, requestOptions)
      .map(res => <number>(res.json().new_messages_count));
  }

  lastMessageId(): Observable<number> {
    return this.http.get('/api/v1/messages/last_id')
      .map(res => <number>(res.json().last_message_id));
  }
}


