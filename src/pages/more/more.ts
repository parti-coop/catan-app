import { Component } from '@angular/core';
import { App, NavController, AlertController } from 'ionic-angular';

import 'rxjs/add/operator/finally';

import { SignInPage } from '../../pages/sign-in/sign-in';
import { PartiEnvironment } from '../../config/constant';
import { MyselfData } from '../../providers/myself-data';

@Component({
  selector: 'page-more',
  templateUrl: 'more.html'
})
export class MorePage {
  disableSignOutButton: boolean = false;

  constructor(
    public navCtrl: NavController,
    public partiEnvironment: PartiEnvironment,
    private alertCtrl: AlertController,
    private myselfData: MyselfData,
    private app: App
  ) {}

  onClickSignOutButton() {
    this.disableSignOutButton = true;
    this.myselfData.signOut()
      .finally(() => {
        this.disableSignOutButton = false;
      }).subscribe(() => {
        let alert = this.alertCtrl.create({
          title: '로그아웃',
          subTitle: '로그아웃 되었습니다. 나중에 다시 만나요.',
          buttons: ['확인']
        });
        alert.present();
        this.app.getRootNav().setRoot(SignInPage);
      }, (error) => {
        let alert = this.alertCtrl.create({
          title: '로그아웃 실패',
          subTitle: '뭔가 잘못되었네요.',
          buttons: ['확인']
        });
        alert.present();
      })
  }
}
