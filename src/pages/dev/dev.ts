import { Component } from '@angular/core';
import { Events, Platform, ModalController, App, NavController } from 'ionic-angular';
import { NativeStorage } from 'ionic-native';

import { OpeningPage } from '../../pages/opening/opening';
import { IntroPage } from '../../pages/intro/intro';
import { EditorPage } from '../../pages/editor/editor';

@Component({
  selector: 'page-dev',
  templateUrl: 'dev.html'
})
export class DevPage {

  constructor(
    public navCtrl: NavController,
    private platform: Platform,
    private app: App,
    private events: Events,
    private modalCtrl: ModalController
  ) {}

  ionViewDidLoad() {
    console.log('Hello Dev Page');
  }

  onClickOpening() {
    this.app.getRootNav().setRoot(OpeningPage);
  }

  onClickIntro() {
    this.app.getRootNav().setRoot(IntroPage);
  }

  onClickClearOpeningShown() {
    this.platform.ready().then(() => {
      NativeStorage.remove('PartiApp_shownIntro').then(() => {
        alert('ok');
      });
    });
  }

  onClickRefresh() {
    this.events.publish('refresh');
  }

  onClickEditor() {
    let editorModal = this.modalCtrl.create(EditorPage);
    editorModal.present();
  }
}
