import { Component } from '@angular/core';
import { App, NavController, AlertController, LoadingController } from 'ionic-angular';

import 'rxjs/add/operator/finally';

import { SignInPage } from '../../pages/sign-in/sign-in';
import { PartiEnvironment } from '../../config/constant';
import { MyselfData } from '../../providers/myself-data';
import { PushService } from '../../providers/push-service';
import { Platform } from 'ionic-angular';
import { InAppBrowser } from 'ionic-native';

@Component({
  selector: 'page-more',
  templateUrl: 'more.html'
})
export class MorePage {

  constructor(
    public navCtrl: NavController,
    public partiEnvironment: PartiEnvironment,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private myselfData: MyselfData,
    private pushService: PushService,
    private platform: Platform,
    private app: App
  ) {}

  onClickToWebBtn(url: string) {
    this.platform.ready().then(() => {
      new InAppBrowser(url, "_blank", "location=true");
    });
  }

  onClickSignOutButton() {
    let loading = this.loadingCtrl.create();
    loading.present();

    this.pushService.cancel((isSuccess: boolean) => {
      this.myselfData.signOut()
        .finally(() => {
          loading.dismiss();
        }).subscribe(() => {
          loading.dismiss().then(() => {
            let alert = this.alertCtrl.create({
              title: '로그아웃',
              subTitle: '로그아웃 되었습니다. 나중에 다시 만나요.',
              buttons: ['확인']
            });
            alert.present();
            this.app.getRootNav().setRoot(SignInPage);
          });
        }, (error) => {
          loading.dismiss().then(() => {
            let alert = this.alertCtrl.create({
              title: '로그아웃 실패',
              subTitle: '뭔가 잘못되었네요.',
              buttons: ['확인']
            });
            alert.present();
          });
        })
    });
  }
}
