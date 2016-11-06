import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, InfiniteScroll } from 'ionic-angular';

import 'rxjs/add/operator/mergeMap';

import { Parti } from '../../models/parti';
import { PostData } from '../../providers/post-data';
import { PartiData } from '../../providers/parti-data';
import { Post } from '../../models/post';

@Component({
  selector: 'page-parti-home',
  templateUrl: 'parti-home.html'
})
export class PartiHomePage {
  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;

  posts: Post[];
  lastPost: Post;
  hasMoreData: boolean = true;
  parti: Parti;
  isFirstPartiHomePage: boolean = false;

  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    private partiData: PartiData,
    private postData: PostData
  ) {
    this.parti = navParams.get('parti');
    this.isFirstPartiHomePage = !this.parti;
  }

  ionViewDidLoad() {
    if(this.isFirstPartiHomePage) {
      this.partiData.first()
        .subscribe((parti: Parti) => {
          this.parti = parti;
          this.load(() => {
            this.disableInfiniteScrollIfNoMoreData(this.infiniteScroll);
          });
        });
    }
    else {
      this.load(() => {
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
    this.postData.parti(this.parti, this.lastPost)
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

  pageTitle() {
    if(!!this.parti) {
      return this.parti.title;
    }

    return '빠띠';
  }

  isLoading(): boolean {
    return !this.parti || !this.posts;
  }
}
