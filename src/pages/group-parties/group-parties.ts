import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Events } from 'ionic-angular';

import { Parti } from '../../models/parti';
import { Group } from '../../models/group';
import { PartiData } from '../../providers/parti-data';
import { PartiHomePage } from '../../pages/parti-home/parti-home';
import { MemberData } from '../../providers/member-data';
/*
  Generated class for the GroupParties page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-group-parties',
  templateUrl: 'group-parties.html'
})
export class GroupPartiesPage {
  parties: { [id: string] : Parti[]; } = {};
  selection: string = 'on_group';
  group: Group;

  constructor(
    public navCtrl: NavController,
    private events: Events,
    private toastCtrl: ToastController,
    private partiData: PartiData,
    private memberData: MemberData,
    private navParams: NavParams) {
    this.group = navParams.get('group');
  }

  ionViewDidLoad() {
    if(!this.parties['on_group']) {
      this.partiData['on_group'](this.group.slug)
        .subscribe((parties: Parti[]) => {
          this.parties['on_group'] = parties;
        }, (error) => {
          this.parties['on_group'] = this.parties['on_group'] || [];
        }, () => {
          this.parties['on_group'] = this.parties['on_group'] || [];
        });
    }
  }

  pageTitle() {
    if(!!this.group) {
      return this.group.name;
    }

    return '그룹';
  }

  onClickParti(parti: Parti) {
    this.navCtrl.push(PartiHomePage, { parti: parti }, {'animate':false});
  }

  onClickJoinParti(parti: Parti) {
    this.memberData.join(parti)
      .subscribe(() => {
        parti.is_member = true;
        this.events.publish('parti:join', parti);
        let toast = this.toastCtrl.create({
          message: '가입되었습니다.',
          duration: 3000
        });
        toast.present();
      });
  }

}
