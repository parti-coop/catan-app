import { Component } from '@angular/core';
import { Validators, FormBuilder, FormControl } from '@angular/forms';
import { App, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

import { NicknameAsyncValidator } from '../../validators/nickname';
import { UserData } from '../../providers/user-data';
import { MyselfData, DuplicateNicknameError } from '../../providers/myself-data';
import { EmailValidator } from '../../validators/email';
import { OpeningPage } from '../../pages/opening/opening';
import { PushService } from '../../providers/push-service';

@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html'
})
export class SignUpPage {
  signUpForm: any;
  nicknameField: any;
  emailField: any;

  snsProvider: string;
  snsAccessToken: string;
  snsSecretToken: string;
  needEmail: boolean;

  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private pushService: PushService,
    private app: App,
    private myselfData: MyselfData,
    private userData: UserData
  ) {

    this.snsProvider = this.navParams.get("snsProvider");
    this.snsAccessToken = this.navParams.get("snsAccessToken");
    this.snsSecretToken = this.navParams.get("snsSecretToken");
    this.needEmail = this.navParams.get("needEmail");

    let emailValidator = this.needEmail ? Validators.compose([Validators.required, EmailValidator.checkEmail]) : null;
    this.signUpForm = this.formBuilder.group({
      nickname: ['', Validators.required, (control: FormControl) => {
        return NicknameAsyncValidator.notExistsNickname(control, userData);
      }],
      email: ['', emailValidator]
    });
    this.nicknameField = this.signUpForm.controls.nickname;
    this.emailField = this.signUpForm.controls.email;
  }

  signUp() {
    let loading = this.loadingCtrl.create();
    loading.present();

    this.myselfData.auth(
      this.snsProvider,
      this.snsAccessToken,
      this.snsSecretToken,
      this.nicknameField.value,
      this.emailField.value)
      .finally(() => {
        loading.dismiss();
      }).subscribe((hasSignedIn) => {
        this.nicknameField.reset();
        this.emailField.reset();
        loading.dismiss().then(() => {
          if(hasSignedIn) {
            this.pushService.init();
            this.app.getRootNav().setRoot(OpeningPage);
          }
        });
      }, (error) => {
        let message = '아! 뭔가 잘못되었습니다.';
        if (error instanceof DuplicateNicknameError) {
          message = '이미 다른 회원이 사용 중인 아이디입니다.';
        }
        console.log("SignUpPage#signUp : " + error);
        loading.dismiss().then(() => {
          let alert = this.alertCtrl.create({
            title: '오류',
            subTitle: message,
            buttons: ['확인']
          });
          alert.present();
        });
      });
  }
}
