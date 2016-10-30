import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { ApiHttp } from '../providers/api-http'
import { Comment } from '../models/comment'
import { Post } from '../models/post'

@Injectable()
export class CommentData {
  constructor(
    private http: ApiHttp
  ) {}

  create(post: Post, body: string): Observable<Comment> {
    let requestOptions = new RequestOptions();
    requestOptions.body = JSON.stringify({
      comment: {
        body: body,
        post_id: post.id
      }
    });
    return this.http.post('/api/v1/comments', requestOptions)
      .map(res => <Comment>(res.json().comment));
  }
}
