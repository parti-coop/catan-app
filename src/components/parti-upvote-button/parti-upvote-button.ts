import { Component, Input } from '@angular/core';

import { Post } from '../../models/post';
import { UpvoteData } from '../../providers/upvote-data';

@Component({
  selector: 'parti-upvote-button',
  templateUrl: 'parti-upvote-button.html'
})
export class PartiUpvoteButton {
  @Input()
  post: Post;

  isLoading: boolean = false;

  constructor(
    private upvoteData: UpvoteData
  ) {}

  onClickUpvoteButton() {
    this.isLoading = true;
    if(this.post.is_upvotable) {
      this.upvoteData.create(this.post.id, 'Post')
        .finally(() => {
          this.isLoading = false;
        })
        .subscribe(() => {
          this.post.is_upvotable = false;
          this.post.upvotes_count++;
        });
    } else {
      this.upvoteData.destroy(this.post.id, 'Post')
        .finally(() => {
          this.isLoading = false;
        })
        .subscribe(() => {
          this.post.is_upvotable = true;
          this.post.upvotes_count--;
        });
    }
  }
}
