import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { NavController } from 'ionic-angular';

import { PartiEnvironment } from '../../config/constant';
import { MyselfData } from '../../providers/myself-data';
import { PostData } from '../../providers/post-data';
import { Post } from '../../models/post';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  posts: Post[];

  constructor(
    public navCtrl: NavController,
    public partiEnvironment: PartiEnvironment,
    public myselfData: MyselfData,
    postData: PostData,
    platform: Platform
  ) {
    postData.dashboard().subscribe(posts => {
      this.posts = posts;
    });
  }
}
