import { Component, ViewChild } from '@angular/core';
import { NavController, MenuController, Events } from 'ionic-angular';

import 'rxjs/add/operator/finally';

import _ from 'lodash';

import { Parti } from '../../models/parti';
import { PartiEnvironment } from '../../config/constant';
import { PartiData } from '../../providers/parti-data';
import { PartiHomePage } from '../../pages/parti-home/parti-home';

@Component({
  selector: 'page-parties',
  templateUrl: 'parties.html'
})
export class PartiesPage {
  @ViewChild('partiesNav') partiesNavCtrl: NavController;
  partiHomePage: any = PartiHomePage;

  parties: { [id: string] : Parti[]; } = {};
  currentParti: Parti;
  selection: string = 'joined';

  constructor(
    public navCtrl: NavController,
    private menuCtrl: MenuController,
    public partiEnvironment: PartiEnvironment,
    private events: Events,
    private partiData: PartiData
  ) {
    this.listenToMemberEvents();
  }

  ionViewDidLoad() {
    for (let key of ['joinedOnly', 'making', 'all']) {
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

  ionViewDidEnter() {
    this.menuCtrl.open();
  }

  partiesMakingCount() {
    return (!!this.parties['making'] ? this.parties['making'].length : "");
  }

  partiesJoinedOnlyCount() {
    return (!!this.parties['joinedOnly'] ? this.parties['joinedOnly'].length : "");
  }

  onClickParti(parti: Parti) {
    if(this.currentParti != parti) {
      this.partiesNavCtrl.setRoot(PartiHomePage, { parti: parti });
    }
    this.menuCtrl.close();
    this.currentParti = parti;
  }

  listenToMemberEvents() {
    this.events.subscribe('parti:join', (data) => {
      let parti: Parti = <Parti>data[0];
      if (!_.includes(this.parties['joinedOnly'], {id: parti.id})) {
        this.parties['joinedOnly'].unshift(parti);
      }
    });
    this.events.subscribe('parti:cancel', (data) => {
      let parti: Parti = <Parti>data[0];
      _.remove(this.parties['joinedOnly'], { id: parti.id });
      _.remove(this.parties['making'], { id: parti.id });
    });
  }
}
