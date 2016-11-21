import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Post } from '../../models/post';
import { ProfilePage } from '../../pages/profile/profile';

@Component({
  selector: 'parti-post-byline',
  templateUrl: 'parti-post-byline.html'
})
export class PartiPostBylineComponent {
  @Input()
  post: Post;

  constructor(
    private navCtrl: NavController
  ) {}

  onClickUser() {
    this.navCtrl.push(ProfilePage, { user: this.post.user });
  }
}
