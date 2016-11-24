import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { App, Events, InfiniteScroll } from 'ionic-angular';

import 'rxjs/add/operator/finally';

import { PartiEnvironment } from '../../config/constant';
import { MyselfData } from '../../providers/myself-data';
import { PostData } from '../../providers/post-data';
import { Post } from '../../models/post';
import { DevPage } from '../../pages/dev/dev';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;

  posts: Post[];
  lastPost: Post;
  hasMorePost: boolean = true;

  constructor(
    public navCtrl: NavController,
    private ref: ChangeDetectorRef,
    private events: Events,
    private app: App,
    public partiEnvironment: PartiEnvironment,
    public myselfData: MyselfData,
    private postData: PostData
  ) {}

  ionViewDidLoad() {
    console.log('home view loading');
    this.load();
  }

  ionViewDidEnter() {
    console.log('home view enter');
    this.ref.detectChanges();
    console.log('detectChanges');
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
        if(!!onCompleted) {
          onCompleted();
        }
      }).subscribe(pagedPosts => {
        this.hasMorePost = pagedPosts.has_more_item;
        if(this.posts == null) {
          this.posts = [];
        }
        this.posts = this.posts.concat(pagedPosts.items);
        if(this.posts.length) {
          this.lastPost = this.posts[this.posts.length-1];
        }
        this.ref.detectChanges();
      });
  }

  private disableInfiniteScrollIfNoMoreData(infiniteScroll) {
    if(!this.hasMorePost) {
      infiniteScroll.enable(false);
    }
  }

  onClickBug() {
    this.app.getRootNav().setRoot(DevPage);
  }
}
