import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder } from '@angular/forms';

import _ from 'lodash';

import { Parti } from '../../models/parti';
import { InvitationData } from '../../providers/invitation-data';
import { EmailValidator } from '../../validators/email';

@Component({
  selector: 'page-email-invitation',
  templateUrl: 'email-invitation.html'
})
export class EmailInvitationPage {
  parti: Parti;
  emailArray: any;
  invitationForm: any;

  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private invitationData: InvitationData
  ) {
    this.parti = navParams.get('parti');

    this.initEmailArray();
    this.invitationForm = this.formBuilder.group({
      emails: this.emailArray
    });

    console.log(this.invitationForm);
  }

  initEmailArray() {
    if(!!this.emailArray) {
      this.emailArray.reset();
    }
    this.emailArray = this.formBuilder.array([]);
    _.times(2, () => { this.addEmailControl() });
  }

  addEmailControl(event = null) {
    if(!!event) { event.preventDefault(); }
    let control = this.formBuilder.control('', [ EmailValidator.checkEmail ]);
    this.emailArray.push(control);
  }

  removeEmailControl(i) {
    this.emailArray.removeAt(i);
  }

  invite() {
    let loader = this.loadingCtrl.create();
    loader.present();

    console.log(JSON.stringify(this.emailArray.value))
    this.invitationData.inviteEmails(this.parti, this.emailArray.value)
      .finally(() => {
        loader.dismiss();
      }).subscribe(() => {
        this.initEmailArray();
        loader.dismiss().then(() => {
          let alert = this.alertCtrl.create({
            title: '완료',
            subTitle: '초대 메일을 발송 했습니다.',
            buttons: ['확인']
          });
          alert.present();
        });
      });
    this.navCtrl.pop();
  }
}
