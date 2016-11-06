import { Component, ViewChild } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';

import 'rxjs/add/operator/finally';

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

  partiesMaking: Parti[];
  partiesJoinedOnly: Parti[];
  partiesAll: Parti[];
  currentParti: Parti;
  selection: string = 'joined';

  constructor(
    public navCtrl: NavController,
    private menuCtrl: MenuController,
    public partiEnvironment: PartiEnvironment,
    private partiData: PartiData
  ) {}

  ionViewDidLoad() {
    console.log('PartiesPage ionViewDidLoad!!!');
    this.partiData.joinedOnly()
      .subscribe((parties: Parti[]) => {
        this.partiesJoinedOnly = parties;
      });
    this.partiData.making()
      .subscribe((parties: Parti[]) => {
        this.partiesMaking = parties;
      });
    this.partiData.all()
      .subscribe((parties: Parti[]) => {
        this.partiesAll = parties;
      });
  }

  ionViewDidEnter() {
    console.log('PartiesPage ionViewDidEnter!!!');
    this.menuCtrl.open();
  }

  partiesMakingCount() {
    return (!!this.partiesMaking ? this.partiesMaking.length : "");
  }

  partiesJoinedOnlyCount() {
    return (!!this.partiesJoinedOnly ? this.partiesJoinedOnly.length : "");
  }

  onClickParti(parti: Parti) {
    if(this.currentParti != parti) {
      this.partiesNavCtrl.setRoot(PartiHomePage, { parti: parti });
    }
    this.menuCtrl.close();
    this.currentParti = parti;
  }
}
