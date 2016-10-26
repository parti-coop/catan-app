import { Component, Input } from '@angular/core';
import { Post } from '../../models/post';

@Component({
  selector: 'parti-post-byline',
  templateUrl: 'parti-post-byline.html'
})
export class PartiPostByline {
  @Input()
  post: Post;

  constructor() {}
}
