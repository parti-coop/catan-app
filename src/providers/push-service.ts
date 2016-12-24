import { Injectable } from '@angular/core';
import { Device } from 'ionic-native';
import { AlertController, ToastController, Events } from 'ionic-angular';

import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/map';

import { MyselfData } from '../providers/myself-data';
import { DeviceTokenData } from '../providers/device-token-data';
import { PartiEnvironment } from '../config/constant';

declare var FCMPlugin;

@Injectable()
export class PushService {
  registrationId: string;

  constructor(
    private myselfData: MyselfData,
    private deviceTokenData: DeviceTokenData,
    private partiEnvironment: PartiEnvironment,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private events: Events
  ) {}

  init() {
    if(Device.isVirtual) {
      console.log("시뮬레이터에서는 푸쉬 받지 않습니다.");
      return;
    }

    FCMPlugin.getToken(
      (token) => {
        this.registrationId = token;
        this.subscribe();
      },
      (err) => {
        console.log('error retrieving token: ' + err);
      });

    FCMPlugin.onNotification(
      (data) => {
        if(data.wasTapped){
          //Notification was received on device tray and tapped by the user.
          this.myselfData.hasSignedIn()
            .then(hasSignedIn => {
              if(!hasSignedIn) {
                console.log("로그인 안되어 있어서 무시합니다");
                return;
              }
              setTimeout(() => {
                if(!!data.title && !!data.body && !!data.type) {
                  this.events.publish(`tabs:${data.type}-deeplink`, data.param);
                } else {
                  console.log("파라미터가 맞질 않습니다");
                  console.log(data);
                }
              }, 500);
            });
        }else{
          //Notification was received in foreground. Maybe the user needs to be notified.
          this.myselfData.hasSignedIn()
            .then(hasSignedIn => {
              if(!hasSignedIn) {
                console.log("로그인 안되어 있어서 무시합니다");
                return;
              }
              if(!!data.title && !!data.body && !!data.type) {
                let toast = this.toastCtrl.create({
                  message: `${data.title} : ${data.body}`,
                  duration: 5000,
                  position: 'top',
                  showCloseButton: true,
                  closeButtonText: '보기'
                });

                toast.onDidDismiss((ignored, role) => {
                  console.log('Dismissed toast');
                  if (role== "close") {
                    this.events.publish(`tabs:${data.type}-deeplink`, data.param);
                  }
                });

                toast.present();
              } else {
                console.log("파라미터가 맞질 않습니다");
                console.log(data);
              }
            });
        }
      },
      (msg) => {
        console.log('onNotification callback successfully registered: ' + msg);
      },
      (err) => {
        console.log('Error registering onNotification callback: ' + err);
      });
  }

  subscribe() {
    if(!this.registrationId) {
      console.log("registrationId가 없습니다.");
      return;
    }

    this.myselfData.hasSignedIn()
      .then(hasSignedIn => {
        if(!hasSignedIn) {
          console.log("로그인 안되어 있어서 키를 저장하지 않습니다.");
          return;
        }
        this.deviceTokenData.register(this.registrationId)
          .subscribe(() => {
            console.log(`푸쉬키 등록 ${this.myselfData} : ${this.registrationId}`);
          });
      });
  }

  unsubscribe(cb?: (boolean) => void) {
    if(!this.registrationId) {
      console.log("registrationId가 없습니다.");
      if(!!cb) { cb(true); }
      return;
    }

    this.myselfData.hasSignedIn()
      .then(hasSignedIn => {
        if(!hasSignedIn) {
          console.log("로그인 안되어 있어서 키를 삭제할 수 없습니다.");
          return;
        }
        this.deviceTokenData.unregister(this.registrationId)
          .finally(() => {
            if(!!cb) { cb(true); }
          })
          .subscribe(
            () => {
              console.log(`푸쉬키 삭제 ${this.myselfData} : ${this.registrationId}`);
            },
            () => {
              console.log(`푸쉬키가 삭제되지 않음 ${this.myselfData} : ${this.registrationId}`);
            });
      });
  }
}
