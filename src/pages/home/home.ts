import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { NavController } from 'ionic-angular';

import { PartiEnvironment } from '../../config/constant';
import { MyselfData } from '../../providers/myself-data';
import { PartiPostData } from '../../providers/parti-post-data';
import { PartiPost } from '../../models/parti-post';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  partiPosts: PartiPost[];

  constructor(
    public navCtrl: NavController,
    public partiEnvironment: PartiEnvironment,
    public myselfData: MyselfData,
    partiPostData: PartiPostData,
    platform: Platform
  ) {
    partiPostData.dashboard().subscribe(partiPosts => {
      this.partiPosts = partiPosts;
    });
  }
}
