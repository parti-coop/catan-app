import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ViewController, InfiniteScroll, Content, App, Scroll } from 'ionic-angular';

import 'rxjs/add/operator/finally';

import { PartiData } from '../../providers/parti-data';
import { PostData } from '../../providers/post-data';
import { Parti } from '../../models/parti';
import { User } from '../../models/user';
import { Post } from '../../models/post';
import { InfinitPage } from '../../models/infinit-page';
import { Shrinkage } from '../../directives/shrinkage';

import { appAnimation } from '../../pages/animation';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  animations: appAnimation
})
export class ProfilePage {
  @ViewChild(Content)
  content: Content;
  @ViewChild(InfiniteScroll)
  infiniteScroll: InfiniteScroll;
  @ViewChild(Shrinkage)
  shrinkage: Shrinkage;
  @ViewChild('#cover')
  cover: ElementRef;
  @ViewChild('#partiesScroll')
  partiesScroll: Scroll;
  @ViewChild('#postsScroll')
  postsScroll: Scroll;

  selection: string = 'parties';
  parties: Parti[];
  user: User;

  posts: Post[];
  lastPost: Post;
  hasMorePost: boolean = true;

  titleState: string = "out";

  constructor(
    public navCtrl: NavController,
    private viewCtrl: ViewController,
    private navParams: NavParams,
    private app: App,
    private partiData: PartiData,
    private postData: PostData
  ) {
    this.user = navParams.get('user');
    //this.app.setScrollDisabled(true);
  }

  ionViewDidLoad() {
    this.partiData.joined(this.user)
      .subscribe((parties: Parti[]) => {
        this.parties = parties;
      });
    this.loadPosts();
  }

  loadMorePosts(infiniteScroll) {
    this.loadPosts(() => {
      infiniteScroll.complete();
      this.disableInfiniteScrollPostIfNoMoreData(infiniteScroll);
    });
  }

  loadPosts(onCompleted: () => void = null) {
    this.postData.byUser(this.user, this.lastPost)
      .finally(() => {
        if(!!onCompleted) {
          onCompleted();
        }
      })
      .subscribe(pagedPosts => {
        this.hasMorePost = pagedPosts.has_more_item;
        if(this.posts == null) {
          this.posts = [];
        }
        this.posts = this.posts.concat(pagedPosts.items);
        if(!!this.posts && this.posts.length > 0) {
          this.lastPost = this.posts[this.posts.length-1];
        }
      });
  }

  private disableInfiniteScrollPostIfNoMoreData(infiniteScroll) {
    if(!this.hasMorePost) {
      infiniteScroll.enable(false);
    }
  }

  // ngAfterViewInit() {
  //   this.content.addScrollListener((event) =>  {
  //     if(event.target.scrollTop > 0) {
  //       this.coverState = "after";
  //       this.titleState = "in";
  //     }
  //   });
  // }

  onClickExtendCover() {
    this.shrinkage.extends();
  }

  onShrinked(event) {
    this.titleState = "in";
  }

  onExtended(event) {
    this.titleState = "out";
  }

  // shrinkCoverDone(event) {
  //   console.log(event);
  //   this.content.resize();
  // }

  // onSwipeUpContentAction(swipeVertical: SwipeVertical) {
  //   this.app.setScrollDisabled(false);
  //   this.coverState = "after";
  //   this.titleState = "in";
  // }
}
