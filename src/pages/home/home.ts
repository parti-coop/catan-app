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
      this.load(() => loader.dismiss(), () => loader.dismiss());
    }
  }

  loadMore(infiniteScroll) {
    this.load(() => {
      infiniteScroll.complete();
      if(!this.hasMoreData) {
        console.log("disable infinite");
        infiniteScroll.enable(false);
      }
    });
  }

  load(onNext: () => void, onError: () => void = null, onCompleted: () => void = null) {
    this.postData.dashboard(this.lastPost).subscribe(pagedPosts => {
      this.hasMoreData = pagedPosts.has_more_item;
      this.posts = this.posts.concat(pagedPosts.items);
      if(this.posts.length) {
        this.lastPost = this.posts[this.posts.length-1];
      }

      if(onNext) {
        onNext();
      }
    }, (error) => {
      console.log("HomePage#load : error - " + error);
      if(onError) {
        onError();
      }
    }, () => {
      if(onCompleted) {
        onCompleted();
      }
    });
  }
}
