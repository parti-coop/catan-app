import { Component } from '@angular/core';
import { NavController, ToastController, Events } from 'ionic-angular';

import 'rxjs/add/operator/finally';

import _ from 'lodash';

import { Parti } from '../../models/parti';
import { PartiEnvironment } from '../../config/constant';
import { PartiData } from '../../providers/parti-data';
import { MemberData } from '../../providers/member-data';
import { PartiHomePage } from '../../pages/parti-home/parti-home';
import { Platform } from 'ionic-angular';
import { InAppBrowser } from 'ionic-native';

@Component({
  selector: 'page-parties',
  templateUrl: 'parties.html'
})
export class PartiesPage {
  parties: { [id: string] : Parti[]; } = {};
  selection: string = 'joined';

  constructor(
    public navCtrl: NavController,
    public partiEnvironment: PartiEnvironment,
    private events: Events,
    private platform: Platform,
    private toastCtrl: ToastController,
    private partiData: PartiData,
    private memberData: MemberData
  ) {
    this.listenToMemberEvents();
  }

  ionViewDidLoad() {
    for (let key of ['joined', 'all']) {
      if(!this.parties[key]) {
        this.partiData[key]()
          .subscribe((parties: Parti[]) => {
            this.parties[key] = parties;
          }, (error) => {
            this.parties[key] = this.parties[key] || [];
          }, () => {
            this.parties[key] = this.parties[key] || [];
          });
      }
    }
  }

  partiesMakingCount() {
    return (!!this.parties['making'] ? this.parties['making'].length : "");
  }

  partiesJoinedOnlyCount() {
    return (!!this.parties['joinedOnly'] ? this.parties['joinedOnly'].length : "");
  }

  onClickParti(parti: Parti) {
    this.navCtrl.push(PartiHomePage, { parti: parti });
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

  onClickPartiMakeBtn() {
    this.platform.ready().then(() => {
      new InAppBrowser('http://parti.xyz/parties/new_intro', "_blank", "location=true");
    });
  }

  listenToMemberEvents() {
    this.events.subscribe('parti:join', (data) => {
      let parti: Parti = <Parti>data[0];
      if (!_.includes(this.parties['joined'], {id: parti.id})) {
        this.parties['joined'].unshift(parti);
      }
    });
    this.events.subscribe('parti:cancel', (data) => {
      let parti: Parti = <Parti>data[0];
      _.remove(this.parties['joined'], { id: parti.id });
      _.remove(this.parties['making'], { id: parti.id });
    });
  }
}
