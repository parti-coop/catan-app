import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import 'rxjs/add/operator/finally';

import { Parti } from '../../models/parti';
import { PartiEnvironment } from '../../config/constant';
import { PartiData } from '../../providers/parti-data';

@Component({
  selector: 'page-parties',
  templateUrl: 'parties.html'
})
export class PartiesPage {
  partiesMaking: Parti[];
  partiesJoinedOnly: Parti[];
  partiesAll: Parti[];
  selection: string = 'joined';

  constructor(
    public navCtrl: NavController,
    public partiEnvironment: PartiEnvironment,
    private partiData: PartiData
  ) {}

  ionViewDidLoad() {
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
