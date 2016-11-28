import { Component } from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';

import { Parti } from '../../models/parti';
import { Member } from '../../models/member';
import { User } from '../../models/user';
import { Post } from '../../models/post';
import { MemberData } from '../../providers/member-data';
import { ProfilePage } from '../../pages/profile/profile';

@Component({
  selector: 'page-members',
  templateUrl: 'members.html'
})
export class MembersPage {

  parti: Parti;
  post: Post;
  members: Member[];
  users: User[];
  choice: string;
  from: string;

  constructor(
    private navCtrl: NavController,
    private viewCtrl: ViewController,
    private navParams: NavParams,
    private memberData: MemberData
  ) {
    this.parti = navParams.get('parti');
    this.post = navParams.get('post');
    this.choice = navParams.get('choice');
    this.from = navParams.get('from');
  }

  ionViewDidLoad() {
    if(this.from == 'parti-home'){
      this.memberData.allOfParti(this.parti)
        .subscribe((members: Member[]) => {
          this.members = members;
        });
    }
    if(this.from == 'post-poll'){
      if(this.choice == 'agree'){
        this.users = this.post.poll.agreed_voting_users;
      }
      if(this.choice == 'disagree'){
        this.users = this.post.poll.disagreed_voting_users;
      }
    }
    if(this.from == 'post-comments'){
      this.users = this.post.comment_users;
    }


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
  partiTitle() {
    if(!!this.parti) {
      return this.parti.title;
    }
    return '빠띠';
  }

  onClickUser(user: User) {
    this.navCtrl.push(ProfilePage, { user: user });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}

