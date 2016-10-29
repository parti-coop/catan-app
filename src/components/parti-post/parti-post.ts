import { Component, Input } from '@angular/core';
import { Post } from '../../models/post';
import { PostPage } from '../../pages/post/post';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'parti-post',
  templateUrl: 'parti-post.html'
})
export class PartiPostComponent {
  @Input()
  post: Post;

  @Input()
  isCollection: boolean;

  constructor(
    private navCtrl: NavController
  ) {}

  onCommentFormFocus(post) {
    this.navCtrl.push(PostPage, {
      post: post
    });
  }
}
