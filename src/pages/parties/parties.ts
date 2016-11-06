import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';

import 'rxjs/add/operator/finally';

import { Parti } from '../../models/parti';
import { PartiEnvironment } from '../../config/constant';
import { PartiData } from '../../providers/parti-data';
import { HomePage } from '../../pages/home/home';

@Component({
  selector: 'page-parties',
  templateUrl: 'parties.html'
})
export class PartiesPage {
  partiHomePage: any = HomePage;

  partiesMaking: Parti[];
  partiesJoinedOnly: Parti[];
  partiesAll: Parti[];
  selection: string = 'joined';

  constructor(
    public navCtrl: NavController,
    private menuCtrl: MenuController,
    public partiEnvironment: PartiEnvironment,
    private partiData: PartiData
  ) {}

  ionViewDidEnter() {
    this.menuCtrl.open();
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

  partiesMakingCount() {
    return (!!this.partiesMaking ? this.partiesMaking.length : "");
  }

  partiesJoinedOnlyCount() {
    return (!!this.partiesJoinedOnly ? this.partiesJoinedOnly.length : "");
  }
}
