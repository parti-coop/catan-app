import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { App, Events, InfiniteScroll, Refresher, Content } from 'ionic-angular';
import { trigger, state, style, transition, animate } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/switchMapTo';

import moment from 'moment';
import _ from 'lodash';

import { PartiEnvironment } from '../../config/constant';
import { MyselfData } from '../../providers/myself-data';
import { PostData } from '../../providers/post-data';
import { Post } from '../../models/post';
import { DevPage } from '../../pages/dev/dev';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  animations: [
    trigger('postTrigger', [
      state('visible', style({
        opacity: 1
      })),
      transition('void => *', [
        style({
          opacity: 0
        }),
        animate('200ms 300ms ease-in')
      ]),
      transition('* => void', [
        animate('200ms'),
        style({
          opacity: 0
        }),
      ])
    ]),
    trigger('indicatorTrigger', [
      state('visible', style({
        transform: 'translateY(0)',
        opacity: 1
      })),
      state('invisible, void', style({
        transform: 'translateY(-100%)',
        opacity: 0
      })),
      transition('* <=> visible', [
        animate(200)
      ])
    ]),
    trigger('spinnerTrigger', [
      state('void, ready', style({
        transform: 'scale(0)',
        opacity: 0
      })),
      state('loading', style({
        transform: 'scale(1)',
        opacity: 1
      })),
      transition('* <=> loading', [
        animate(280)
      ])
    ])
  ]
})
export class HomePage {
  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;
  @ViewChild(Content) content: Content;
  @ViewChild(Refresher) refresher: Refresher;

  posts: Post[];
  isForceRefreshingStat: boolean = false;
  isRefreshingStat: boolean = false;
  hasPreviousPosts: boolean = false;

  newPostsCountLabel: string;
  newPostsCountStat: string = 'invisible';
  newPostsCountStatResettter: any;
  shownNewPostsCount: boolean = false;
  newPostsCountSubscription: Subscription;

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
    this.loadNewest();
    this.newPostsCountSubscription = this.pollingNewPostCount();
  }

  ionViewDidEnter() {
    this.ref.detectChanges();
  }

  ionViewWillUnload() {
    console.log('ionViewWillUnload');
    this.newPostsCountSubscription.unsubscribe();
  }

  pollingNewPostCount(): Subscription {
    return Observable
      .interval(60 * 2000)
      .startWith(0)
      .subscribe(() => {
        let lastTouchedAt = _.head(this.posts) && _.head(this.posts).last_touched_at;
        if(!lastTouchedAt) {
          return;
        }
        this.postData.newPostsCount(lastTouchedAt)
          .subscribe((count) => {
            if(!this.isRefreshingStat) {
              this.updateNewPostsCount(count);
            }
          });
      });
  }

  loadNewest(onCompleted: () => void = null) {
    this.isRefreshingStat = true;
    this.postData.dashboard()
      .finally(() => {
        onCompleted && onCompleted();
        this.isRefreshingStat = false;
      }).subscribe(newPosts => {
        this.resetNewPostsCount();
        if(this.posts == null) {
          this.posts = [];
          this.hasPreviousPosts = newPosts.has_more_item;
        }
        if(newPosts.items) {
          let newLastPost = _.last(newPosts.items);
          let currentFirstPost = _.head(this.posts);

          let overlap = !!newLastPost && !!currentFirstPost
            && moment(currentFirstPost.last_touched_at) > moment(newLastPost.last_touched_at)
          if(overlap) {
            console.log('prepend');
            _(newPosts.items).reverse().each((newPost) => {
              let originPost = _(this.posts).find((post) => {
                return newPost.id == post.id;
              });

              if(!!originPost) {
                if(moment(newPost.last_touched_at) > moment(originPost.last_touched_at)) {
                  _.remove(this.posts, (post) => {
                    return originPost.id == post.id;
                  });
                  this.posts.unshift(newPost);
                } else {
                  // do nothing
                }
              } else {
                this.posts.unshift(newPost);
              }
            })
          } else {
            console.log('reload all');
            this.posts = newPosts.items;
            this.hasPreviousPosts = newPosts.has_more_item;
          }
        }
        this.afterUpdatedPosts();
      });
  }

  loadMore(infiniteScroll) {
    console.log("infinite");
    this.postData.dashboard(_.last(this.posts))
      .finally(() => {
        infiniteScroll.complete();
        if(!this.hasPreviousPosts) {
          infiniteScroll.enable(false);
        }
      }).subscribe(pagedPosts => {
        this.hasPreviousPosts = pagedPosts.has_more_item;
        if(this.posts == null) {
          this.posts = [];
        }
        this.posts = this.posts.concat(pagedPosts.items);
        this.afterUpdatedPosts();
      });
  }

  afterUpdatedPosts() {
    this.ref.detectChanges();
  }

  onRefresh(refresher) {
    this.loadNewest(() => {
      setTimeout(() => {
        refresher.complete();
      }, 500);
    });
  }

  onClickBug() {
    this.app.getRootNav().setRoot(DevPage);
  }

  onClickNewPostIndicator() {
    this.isForceRefreshingStat = true;
    this.loadNewest(() => {
      setTimeout(() => {
        this.isForceRefreshingStat = false;
      }, 500);
    });
    this.content.scrollToTop();
  }

  resetNewPostsCount() {
    this.shownNewPostsCount = false;
    this.updateNewPostsCount(0);
  }

  updateNewPostsCount(count: number) {
    let hasNewPosts = (!!count && count > 0);
    if(hasNewPosts) {
      this.newPostsCountLabel = count > 999 ? '999+' : String(count);
      if(!this.shownNewPostsCount && this.content.getScrollTop() > 100) {
        if(!!this.newPostsCountStatResettter) {
          clearTimeout(this.newPostsCountStatResettter);
        }
        this.newPostsCountStatResettter = setTimeout(() => {
          this.newPostsCountStat = 'invisible';
        }, 5000);
        this.newPostsCountStat = 'visible';

        this.shownNewPostsCount = true;
      }
    } else {
      this.newPostsCountLabel = null;
      this.newPostsCountStat = 'invisible';
    }
    this.events.publish('tabs:new-posts-count', this.newPostsCountLabel);
  }
}
