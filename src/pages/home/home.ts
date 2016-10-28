import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Events, LoadingController } from 'ionic-angular';

import 'rxjs/add/operator/finally';

import { PartiEnvironment } from '../../config/constant';
import { MyselfData } from '../../providers/myself-data';
import { PostData } from '../../providers/post-data';
import { Post } from '../../models/post';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  posts: Post[] = [];
  lastPost: Post;
  hasMoreData: boolean = true;

  constructor(
    public navCtrl: NavController,
    public partiEnvironment: PartiEnvironment,
    public myselfData: MyselfData,
    private postData: PostData,
    private events: Events,
    private loadingCtrl: LoadingController
  ) {}

  ionViewDidEnter() {
    let loader = this.loadingCtrl.create();
    loader.present();
    if(!this.posts.length) {
      this.load(() => {
        loader.dismiss();
      });
    }
  }

  loadMore(infiniteScroll) {
    this.load(() => {
      infiniteScroll.complete();
      if(!this.hasMoreData) {
        console.log("disable infinite")
        infiniteScroll.enable(false);
      }
    });
  }

  load(callback: () => void) {
    this.postData.dashboard(this.lastPost).subscribe(pagedPosts => {
      this.hasMoreData = pagedPosts.has_more_item;
      this.posts = this.posts.concat(pagedPosts.items);
      if(this.posts.length) {
        this.lastPost = this.posts[this.posts.length-1];
      }

      if(callback) {
        callback();
      }
    }, (error) => {
      this.events.publish('app:error');
      console.log("ApiHttps#intercept : error - " + error);
    });
  }
}
