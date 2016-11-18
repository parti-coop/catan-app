import { Component, Input } from '@angular/core';
import { Parti } from '../../models/parti';
import { NavController, ToastController, Events } from 'ionic-angular';

import { PartiHomePage } from '../../pages/parti-home/parti-home';
import { MemberData } from '../../providers/member-data';

@Component({
  selector: 'parti-list',
  templateUrl: 'parti-list.html'
})
export class PartiList {

  @Input()
  parties: Parti[];
  text: string;

  constructor(
    public navCtrl: NavController,
    private events: Events,
    private toastCtrl: ToastController,
    private memberData: MemberData
  ) {}

  onClickParti(parti: Parti) {
    this.navCtrl.push(PartiHomePage, { parti: parti });
  }

  onClickJoinParti(parti: Parti) {
    this.memberData.join(parti)
      .subscribe(() => {
        parti.is_member = true;
        this.events.publish('parti:join', parti);
        let toast = this.toastCtrl.create({
          message: '가입되었습니다.',
          duration: 3000
        });
        toast.present();
      });
  }
}
