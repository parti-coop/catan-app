import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Events, LoadingController, InfiniteScroll } from 'ionic-angular';

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

  // ionViewLoaded() {
  //   this.todo = this.formBuilder.group({
  //     title: ['', Validators.required],
  //     description: [''],
  //   });
  // }

  ionViewDidEnter() {
    if(!this.posts.length) {
      let loader = this.loadingCtrl.create();
      loader.present();
      this.load(() => {
        loader.dismiss();
        this.disableInfiniteScrollIfNoMoreData(this.infiniteScroll);
      });
    }
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
          console.log("dashboard completed!");
          onCompleted();
        }
      }).subscribe(pagedPosts => {
        console.log("loading dashboard data!");
        this.hasMoreData = pagedPosts.has_more_item;
        this.posts = this.posts.concat(pagedPosts.items);
        if(this.posts.length) {
          this.lastPost = this.posts[this.posts.length-1];
        }
      });
  }

  private disableInfiniteScrollIfNoMoreData(infiniteScroll) {
    if(!this.hasMoreData) {
      console.log("disable infinite");
      infiniteScroll.enable(false);
    }
  }
}
