import { Component } from '@angular/core';
import { NavController, AlertController, ViewController, NavParams } from 'ionic-angular';

import { PartiHomePage } from '../../pages/parti-home/parti-home';

@Component({
  selector: 'page-cancel-parti-member',
  templateUrl: 'cancel-parti-member.html'
})
export class CancelPartiMemberPage {
  partiHomePage: PartiHomePage;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    private navParams: NavParams
  ) {}

  ngOnInit() {
    if (this.navParams.data) {
      this.partiHomePage = this.navParams.get("partiHomePage");
    }
  }

  onClickCancelMember() {
    let alert = this.alertCtrl.create({
      title: '확인',
      message: '정말 탈퇴하시겠습니까?',
      buttons: [
        {
          text: '취소',
          role: 'cancel',
          handler: () => {
            this.viewCtrl.dismiss();
          }
        },
        {
          text: '탈퇴합니다',
          handler: () => {
            this.partiHomePage.onClickCancelParti();
            this.viewCtrl.dismiss();
          }
        }
      ]
    });
    alert.present();
  }
}
