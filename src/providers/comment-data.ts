import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import { ApiHttp } from '../providers/api-http'
import { Comment } from '../models/comment'
import { Post } from '../models/post'
import { InfinitePage } from '../models/infinite-page';

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

  byPost(post: Post, lastComment: Comment = null): Observable<InfinitePage<Comment>> {
    let requestOptions = new RequestOptions();
    let searchParams = new URLSearchParams();
    searchParams.set('post_id', String(post.id));
    if(lastComment) {
      searchParams.set('last_id', String(lastComment.id));
    }
    requestOptions.search = searchParams;
    return this.http.get(`/api/v1/comments/by_post`, requestOptions)
      .map(res => <InfinitePage<Comment>>(res.json()));
  }
}
