import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';

import { RequestOptions, URLSearchParams } from '@angular/http';
import { ApiHttp } from '../providers/api-http'
import { Message } from '../models/message'
import { InfinitPage } from '../models/infinit-page'

@Injectable()
export class MessageData {
  constructor(
    private http: ApiHttp
  ){
    console.log('Hello MessageData Provider');
  }

  fetch(): Observable<Message[]> {
    return this.http.get('/api/v1/messages')
      .map(req => <Message[]>(req.json().messages));
  }
}


