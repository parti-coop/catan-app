import { Component, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { NavController, NavParams, ViewController, InfiniteScroll, Content, App, Scroll, Platform } from 'ionic-angular';
import { InAppBrowser } from 'ionic-native';

import 'rxjs/add/operator/finally';

import { PartiData } from '../../providers/parti-data';
import { PostData } from '../../providers/post-data';
import { MyselfData } from '../../providers/myself-data';
import { Parti } from '../../models/parti';
import { User } from '../../models/user';
import { Post } from '../../models/post';
import { MorePage } from '../../pages/more/more';
import { InfinitPage } from '../../models/infinit-page';
import { Shrinkage } from '../../directives/shrinkage';
import { PostPage } from '../../pages/post/post';

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
  @ViewChild('cover')
  cover: ElementRef;
  @ViewChild('coverItem')
  coverItems: any[];
  @ViewChild('partiesScroll')
  partiesScroll: Scroll;
  @ViewChild('postsScroll')
  postsScroll: Scroll;

  selection: string = 'parties';
  parties: Parti[];
  user: User;

  posts: Post[];
  lastPost: Post;
  hasMorePost: boolean = true;

  titleState: string = "out";
  isMe: boolean = false;

  constructor(
    public navCtrl: NavController,
    private viewCtrl: ViewController,
    private navParams: NavParams,
    private app: App,
    private platform: Platform,
    public myselfData: MyselfData,
    private partiData: PartiData,
    private postData: PostData
  ) {
    this.user = navParams.get('user');
    if (!this.user)
      this.user = this.myselfData.asModel()
    if (this.user.id == myselfData.id)
      this.isMe = true;
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

  onClickSettings() {
    this.navCtrl.push(MorePage, {'animate':false});
  }

  onClickPost(post: Post) {
    this.navCtrl.push(PostPage, {
      post: post});
  }

  private disableInfiniteScrollPostIfNoMoreData(infiniteScroll) {
    if(!this.hasMorePost) {
      infiniteScroll.enable(false);
    }
  }

  onClickExtendCover() {
    this.shrinkage.extends();
  }

  onShrinked(event) {
    this.titleState = "in";
  }

  onExtended(event) {
    this.titleState = "out";
  }

  onClickProfileEditBtn() {
    this.platform.ready().then(() => {
      new InAppBrowser('http://parti.xyz/users/edit', "_blank", "location=true");
    });
  }
}
