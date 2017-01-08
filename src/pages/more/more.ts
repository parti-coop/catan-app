import { Component } from '@angular/core';
import { App, NavController, AlertController, ViewController,
  LoadingController, ToastController } from 'ionic-angular';

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
    public viewCtrl: ViewController,
    public partiEnvironment: PartiEnvironment,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
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
    let alert = this.alertCtrl.create({
      title: '확인',
      message: '정말 로그아웃하시겠습니까?',
      buttons: [
        {
          text: '취소',
          role: 'cancel',
        },
        {
          text: '로그아웃',
          handler: () => {
            this.signOut();
          }
        }
      ]
    });
    alert.present();
  }

  signOut() {
    let loading = this.loadingCtrl.create();
    loading.present();

    this.pushService.unsubscribe((isSuccess: boolean) => {
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
            let toast = this.toastCtrl.create({
              message: '아! 뭔가 잘못되었습니다.',
              duration: 3000
            });
            toast.present();
          });
        })
    });
  }
}
