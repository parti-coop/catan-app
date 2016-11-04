import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import 'rxjs/add/operator/finally';

import { Parti } from '../../models/parti';
import { PartiEnvironment } from '../../config/constant';
import { PartiData } from '../../providers/parti-data';

@Component({
  selector: 'page-parties',
  templateUrl: 'parties.html'
})
export class PartiesPage {
  parties: Parti[];
  selection: string = 'watched';

  constructor(
    public navCtrl: NavController,
    public partiEnvironment: PartiEnvironment,
    private loadingCtrl: LoadingController,
    private partiData: PartiData
  ) {}

  ionViewDidLoad() {
    let loader = this.loadingCtrl.create();
    loader.present();
    this.partiData.watchedParties()
      .finally(() => {
        loader.dismiss();
      }).subscribe((parties: Parti[]) => {
        this.parties = parties
      });
   }
}
