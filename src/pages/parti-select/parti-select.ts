import { Component } from '@angular/core';
import { NavController, ViewController, Platform, NavParams } from 'ionic-angular';

import { MyselfData } from '../../providers/myself-data';
import { Parti } from '../../models/parti';

@Component({
  selector: 'page-parti-select',
  templateUrl: 'parti-select.html'
})
export class PartiSelectPage {
  parties: Parti[];
  seletedParti: Parti;

  constructor(
    public navCtrl: NavController,
    private viewController: ViewController,
    private platform: Platform,
    private navParams: NavParams,
    private myselfData: MyselfData
  ) {
    this.seletedParti = this.navParams.get("parti");
    this.parties = this.navParams.get("parties");
  }

  ionViewDidLoad() {
    this.registerBackButtonListener();
  }

  isSelected(parti) {
    return !!this.seletedParti && this.seletedParti.id == parti.id;
  }

  onClickParti(parti) {
    this.seletedParti == parti;
    this.viewController.dismiss({ parti: parti });
  }

  registerBackButtonListener() {
    this.platform.registerBackButtonAction(() => {
      this.viewController.dismiss();
    });
  }
}
