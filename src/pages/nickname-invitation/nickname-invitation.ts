import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, FormControl } from '@angular/forms';

import _ from 'lodash';

import { Parti } from '../../models/parti';
import { InvitationData } from '../../providers/invitation-data';
import { UserData } from '../../providers/user-data';
import { NicknameAsyncValidator } from '../../validators/nickname';

@Component({
  selector: 'page-nickname-invitation',
  templateUrl: 'nickname-invitation.html'
})
export class NicknameInvitationPage {
  parti: Parti;
  nicknameArray: any;
  invitationForm: any;

  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private invitationData: InvitationData,
    private userData: UserData
  ) {
    this.parti = navParams.get('parti');

    this.initNicknameArray();
    this.invitationForm = this.formBuilder.group({
      nicknames: this.nicknameArray
    });

    console.log(this.invitationForm);
  }

  initNicknameArray() {
    if(!!this.nicknameArray) {
      this.nicknameArray.reset();
    }
    this.nicknameArray = this.formBuilder.array([]);
    _.times(2, () => { this.addNicknameControl() });
  }

  addNicknameControl(event = null) {
    if(!!event) { event.preventDefault(); }

    let control = this.formBuilder.control('', null, (control: FormControl) => {
      return NicknameAsyncValidator.checkNickname(control, this.userData);
    });
    this.nicknameArray.push(control);
  }

  removeNicknameControl(i) {
    this.nicknameArray.removeAt(i);
  }

  invite() {
    let loader = this.loadingCtrl.create();
    loader.present();

    console.log(JSON.stringify(this.nicknameArray.value))
    this.invitationData.inviteNicknames(this.parti, this.nicknameArray.value)
      .finally(() => {
        loader.dismiss();
      }).subscribe(() => {
        this.initNicknameArray();
        loader.dismiss().then(() => {
          let alert = this.alertCtrl.create({
            title: '완료',
            subTitle: '초대했습니다.',
            buttons: ['확인']
          });
          alert.present();
        });
      });
    this.navCtrl.pop();
  }
}
