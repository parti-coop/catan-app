import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Events, InfiniteScroll } from 'ionic-angular';

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
  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;

  posts: Post[];
  lastPost: Post;
  hasMoreData: boolean = true;

  constructor(
    public navCtrl: NavController,
    private events: Events,
    public partiEnvironment: PartiEnvironment,
    public myselfData: MyselfData,
    private postData: PostData
  ) {}

  ionViewDidLoad() {
    console.log('home view loading');
    this.load(() => {
      this.disableInfiniteScrollIfNoMoreData(this.infiniteScroll);
    });
  }

  loadMore(infiniteScroll) {
    this.load(() => {
      infiniteScroll.complete();
      this.disableInfiniteScrollIfNoMoreData(infiniteScroll);
    });
  }

  load(onCompleted: () => void = null) {
    this.postData.dashboard(this.lastPost)
      .finally(() => {
        if(onCompleted) {
          onCompleted();
        }
      }).subscribe(pagedPosts => {
        this.hasMoreData = pagedPosts.has_more_item;
        if(this.posts == null) {
          this.posts = [];
        }
        this.posts = this.posts.concat(pagedPosts.items);
        if(this.posts.length) {
          this.lastPost = this.posts[this.posts.length-1];
        }
      });
  }

  private disableInfiniteScrollIfNoMoreData(infiniteScroll) {
    if(!this.hasMoreData) {
      infiniteScroll.enable(false);
    }
  }

  isLoading() {
    return !this.posts;
  }
}
