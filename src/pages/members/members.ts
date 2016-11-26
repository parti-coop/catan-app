import { Component } from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';

import { Parti } from '../../models/parti';
import { Member } from '../../models/member';
import { MemberData } from '../../providers/member-data';
import { ProfilePage } from '../../pages/profile/profile';

@Component({
  selector: 'page-members',
  templateUrl: 'members.html'
})
export class MembersPage {

  parti: Parti;
  members: Member[];

  constructor(
    private navCtrl: NavController,
    private viewCtrl: ViewController,
    private navParams: NavParams,
    private memberData: MemberData
  ) {
    this.parti = navParams.get('parti');
  }

  ionViewDidLoad() {
    this.memberData.allOfParti(this.parti)
      .subscribe((members: Member[]) => {
        this.members = members;
      });
  }

  pageTitle() {
    if(!!this.parti) {
      return this.parti.members_count;
    }
    return 0;
  }
  partiTitle() {
    if(!!this.parti) {
      return this.parti.title;
    }
    return '빠띠';
  }

  onClickUser(member: Member) {
    this.navCtrl.push(ProfilePage, { user: member.user });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}

