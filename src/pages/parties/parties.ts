import { Component } from '@angular/core';
import { NavController, ToastController, Events, Platform } from 'ionic-angular';

import 'rxjs/add/operator/finally';

import _ from 'lodash';

import { Parti } from '../../models/parti';
import { Group } from '../../models/group';
import { PartiEnvironment } from '../../config/constant';
import { PartiData } from '../../providers/parti-data';
import { MemberData } from '../../providers/member-data';
import { TagData } from '../../providers/tag-data';
import { MyselfData } from '../../providers/myself-data';
import { GroupData } from '../../providers/group-data';
import { PartiHomePage } from '../../pages/parti-home/parti-home';
import { GroupPartiesPage } from '../../pages/group-parties/group-parties';

export interface Tag {
  name: string;
}

@Component({
  selector: 'page-parties',
  templateUrl: 'parties.html'
})
export class PartiesPage {
  parties: { [id: string] : Parti[]; } = {};
  selection: string = 'joined';
  groups: Group[];
  has_group: boolean = false;
  tags: Tag[];

  constructor(
    public navCtrl: NavController,
    public partiEnvironment: PartiEnvironment,
    private events: Events,
    private platform: Platform,
    private toastCtrl: ToastController,
    private tagData: TagData,
    private partiData: PartiData,
    private groupData: GroupData,
    private myselfData: MyselfData,
    private memberData: MemberData
  ) {
    this.listenToMemberEvents();
  }

  ionViewDidLoad() {
    let observables = {
      joined: this.partiData.joined(this.myselfData.asModel()),
      all: this.partiData.all()
    };
    for (let key in observables) {
      if(!this.parties[key]) {
          observables[key].subscribe((parties: Parti[]) => {
            this.parties[key] = parties;
          }, (error) => {
            this.parties[key] = this.parties[key] || [];
          }, () => {
            this.parties[key] = this.parties[key] || [];
          });
      }
    }
    this.groupData.joined().subscribe((groups: Group[]) => {
      this.groups = groups;
      for(let group of groups) {
        this.has_group = true;
        break;
      }
    });
    this.tagData.mostUsedOnParties(100).subscribe((tagNames: string[]) => {
      this.tags = _.map(tagNames, (tagName) => <Tag>({ name: tagName}));
    });
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

  onClickGroup(group: Group) {
    this.navCtrl.push(GroupPartiesPage, { group: group }, {'animate':false});
  }

  onClickTag(tag: Tag) {
    this.selection = "tagged";
    this.partiData.tagged([tag.name]).subscribe((parties: Parti[]) => {
            this.parties['tagged'] = parties;
          }, (error) => {
            this.parties['tagged'] = this.parties['tagged'] || [];
          }, () => {
            this.parties['tagged'] = this.parties['tagged'] || [];
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
