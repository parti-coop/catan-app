import { Component, Input } from '@angular/core';
import { Post } from '../../models/post';
import { PostPage } from '../../pages/post/post';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'parti-post-panel',
  templateUrl: 'parti-post-panel.html'
})
export class PartiPostPanelComponent {
  @Input()
  post: Post;

  @Input()
  isCollection: boolean;

  constructor(
    private navCtrl: NavController
  ) {}

  onClickCommentButton() {
    this.navCtrl.push(PostPage, {
      post: this.post
    });
  }
}
