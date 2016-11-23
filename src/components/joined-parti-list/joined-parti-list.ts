import { Component, Input } from '@angular/core';
import { Parti } from '../../models/parti';
import { NavController } from 'ionic-angular';

import { PartiHomePage } from '../../pages/parti-home/parti-home';
import { MemberData } from '../../providers/member-data';

@Component({
  selector: 'joined-parti-list',
  templateUrl: 'joined-parti-list.html'
})
export class JoinedPartiList {

  @Input()
  parties: Parti[];
  text: string;

  constructor(
    public navCtrl: NavController,
    private memberData: MemberData
  ) {}

  onClickParti(parti: Parti) {
    this.navCtrl.push(PartiHomePage, { parti: parti });
  }
}
