import { Component, ElementRef, Renderer } from '@angular/core';
import { NavController, ViewController, Platform, NavParams } from 'ionic-angular';

import _ from 'lodash';

import { MyselfData } from '../../providers/myself-data';
import { Parti } from '../../models/parti';

@Component({
  selector: 'page-parti-select',
  templateUrl: 'parti-select.html'
})
export class PartiSelectPage {
  groupingParties: any = [];
  seletedParti: Parti;

  constructor(
    public navCtrl: NavController,
    private viewCtrl: ViewController,
    private platform: Platform,
    private elm: ElementRef,
    private renderer: Renderer,
    private navParams: NavParams,
    private myselfData: MyselfData
  ) {
    this.seletedParti = this.navParams.get("parti");
    this.groupingParties = this.groupParties(this.navParams.get("parties"));
  }

  ngAfterViewInit() {
    let modalWrapper = this.elm.nativeElement.parentElement;
    let ionModal = modalWrapper.parentElement;
    this.renderer.setElementStyle(ionModal, 'padding', '5%');
    let ionBackDrop = ionModal.getElementsByTagName("ION-BACKDROP")[0];
    this.renderer.setElementStyle(ionBackDrop, 'visibility', 'visible');
    this.renderer.setElementStyle(ionBackDrop, 'z-index', '0');
  }

  ionViewDidLoad() {
    this.registerBackButtonListener();
  }

  groupParties(parties: Parti[]) {
    let _paramParties = _(parties);
    let dictParties: { [id: string] : Parti[]; } = {};
    if(!_paramParties.isEmpty()) {
      _paramParties.each((parti) => {
        let groupName = parti.group ? parti.group.name : ''
        if(_.isEmpty(dictParties[groupName])) {
          dictParties[groupName] = [];
        }

        dictParties[groupName].push(parti);
      });
    }

    return _.sortBy(_.toPairs(dictParties), (pair) => { return -1 * pair[1].length; });
  }

  isSelected(parti) {
    return !!this.seletedParti && this.seletedParti.id == parti.id;
  }

  onClickParti(parti) {
    this.seletedParti == parti;
    this.viewCtrl.dismiss({ parti: parti });
  }

  registerBackButtonListener() {
    this.platform.registerBackButtonAction(() => {
      this.viewCtrl.dismiss();
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
