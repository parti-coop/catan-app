import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Push, PushNotification, Device } from 'ionic-native';
import { AlertController } from 'ionic-angular';

import 'rxjs/add/operator/map';

import { MyselfData } from '../providers/myself-data';
import { DeviceTokenData } from '../providers/device-token-data';
import { PartiEnvironment } from '../config/constant';

@Injectable()
export class PushService {

  push: PushNotification;
  registrationId: string;

  constructor(
    private myselfData: MyselfData,
    private deviceTokenData: DeviceTokenData,
    private partiEnvironment: PartiEnvironment,
    private alertCtrl: AlertController
  ) {}

  init() {
    if(Device.device.isVirtual) {
      console.log("시뮬레이터에서는 푸쉬 받지 않습니다.");
      return;
    }

    this.myselfData.hasSignedIn()
      .then(hasSignedIn => {
        if(!hasSignedIn) {
          return;
        }

        this.push = Push.init({
          android: {
            senderID: this.partiEnvironment.fcmSenderId
          },
          ios: {
            alert: "true",
            badge: false,
            sound: "true"
          },
          windows: {}
        });

        this.push.on('registration', (data) => {
          this.registrationId = data.registrationId;
          console.log("device token ->", this.registrationId);
          this.deviceTokenData.register(this.registrationId)
            .subscribe(() => { console.log(`푸쉬키 등록 ${this.myselfData} : ${this.registrationId}`); });
        });

        this.push.on('notification', (data) => {
          console.log('message', data.message);
          let self = this;
          //if user using app and push notification comes
          if (data.additionalData.foreground) {
            // if application open, show popup
            let confirmAlert = this.alertCtrl.create({
              title: '알림',
              message: data.message,
              buttons: [{
                text: '나중에 보기',
                role: 'cancel'
              }, {
                text: 'View',
                handler: () => {
                  //TODO: Your logic here
                  //로그인 전이라면?
                  //로그인한 유저의 메시지가 아니라면?
                  console.log(data.message);
                  //self.nav.push(DetailsPage, {message: data.message});
                }
              }]
            });
            confirmAlert.present();
          } else {
            //if user NOT using app and push notification comes
            //TODO: Your logic on click of push notification directly
            //self.nav.push(DetailsPage, {message: data.message});
            console.log("Push notification clicked");
          }
        });
        this.push.on('error', (e) => {
          console.log(e.message);
        });
      }).catch((error) => {
        console.log("PartiApp#initPush : 로그인 확인 실패 - " + error);
        throw error;
      });
  }

  cancel(cb?: (boolean) => void) {
    if(!this.isActive()) {
      cb(true);
      return;
    }

    let currentRegistrationId = this.registrationId;
    console.log("Start push unregister");
    this.push.unregister(
      () => {
        this.myselfData.hasSignedIn()
          .then(hasSignedIn => {
            this.deviceTokenData.unregister(currentRegistrationId)
              .subscribe(() => {
                console.log(`푸쉬키 삭제 ${this.myselfData} : ${currentRegistrationId}`);
              }, () => {
                console.log(`푸쉬키가 삭제되지 않음 ${this.myselfData} : ${currentRegistrationId}`);
              });
          }).then(() => {
            if(!!cb) { cb(true); }
          });
      },
      () => {
        console.log('푸쉬 중단 실패');
        if(!!cb) { cb(false); }
      });
    this.registrationId = null;
  }

  isActive() {
    return (!!this.push && !!this.registrationId);
  }
}
