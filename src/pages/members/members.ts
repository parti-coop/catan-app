import { Component, ViewChild } from '@angular/core';
import { NavController, Platform, ViewController, NavParams, InfiniteScroll } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';

import _ from 'lodash';

import { Parti } from '../../models/parti';
import { Member } from '../../models/member';
import { User } from '../../models/user';
import { Post } from '../../models/post';
import { Voting } from '../../models/voting';
import { Upvote } from '../../models/upvote';
import { UserAction } from '../../models/user-action';
import { InfinitePage } from '../../models/infinite-page';

import { MemberData } from '../../providers/member-data';
import { PartiData } from '../../providers/parti-data';
import { VotingData } from '../../providers/voting-data';
import { UpvoteData } from '../../providers/upvote-data';
import { ProfilePage } from '../../pages/profile/profile';

@Component({
  selector: 'page-members',
  templateUrl: 'members.html'
})
export class MembersPage {
  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;

  parti: Parti;
  post: Post;
  hasPreviousUserAction: boolean = false;
  userActions: UserAction[];
  choice: string;
  from: string;

  constructor(
    private platform: Platform,
    private navCtrl: NavController,
    private viewCtrl: ViewController,
    private navParams: NavParams,
    private votingData: VotingData,
    private upvoteData: UpvoteData,
    private partiData: PartiData,
    private memberData: MemberData
  ) {
    this.parti = navParams.get('parti');
    this.post = navParams.get('post');
    this.choice = navParams.get('choice');
    this.from = navParams.get('from');
  }

  ionViewDidLoad() {
    this.registerBackButtonListener();
    this.loadFirst();
  }

  loadFirst() {
    this.userActionObservable() && this.userActionObservable().subscribe((pagedUserActions: InfinitePage<UserAction>) => {
      this.userActions = pagedUserActions.items;
      this.hasPreviousUserAction = pagedUserActions.has_more_item;
    });
  }

  loadMore(infiniteScroll) {
    this.userActionObservable() && this.userActionObservable()
      .finally(() => {
        infiniteScroll.complete();
        if(!this.hasPreviousUserAction) {
          infiniteScroll.enable(false);
        }
      }).subscribe(pagedUserActions => {
        this.hasPreviousUserAction = pagedUserActions.has_more_item;
        if(this.userActions == null) {
          this.userActions = [];
        }
        this.userActions = this.userActions.concat(pagedUserActions.items);
      });
  }

  userActionObservable(): Observable<InfinitePage<UserAction>> {
    let lastUserAction = _.last(this.userActions);
    if(this.from == 'parti-home'){
      return this.partiData.members(this.parti, <Member>lastUserAction);
    }
    if(this.from == 'post-poll'){
      if(this.choice == 'agree'){
        return  this.votingData.agreesOfPoll(this.post.poll, <Voting>lastUserAction);
        //this.users = this.post.poll.latest_agreed_voting_users;
      }
      if(this.choice == 'disagree'){
        //this.users = this.post.poll.latest_disagreed_voting_users;
        return this.votingData.disagreesOfPoll(this.post.poll, <Voting>lastUserAction);
      }
    }
    if(this.from == 'post-upvotes'){
      //this.users = this.post.latest_upvote_users;
      return this.upvoteData.ofPost(this.post, <Upvote>lastUserAction);
    }

    return null;
  }

  pageTitle() {
    if(this.from == 'parti-home'){
      if(!!this.parti) {
        return this.parti.members_count;
      }
      return 0;
    }else {
      return 0;
    }
  }

  onClickUser(user: User) {
    this.navCtrl.push(ProfilePage, { user: user });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  registerBackButtonListener() {
    this.platform.registerBackButtonAction(() => {
      this.viewCtrl.dismiss();
    });
  }
}

