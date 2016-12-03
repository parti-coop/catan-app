import { Directive, ElementRef,
         Renderer, AfterViewInit } from '@angular/core';
import { InAppBrowser } from 'ionic-native';
import { NavController } from 'ionic-angular';

import _ from 'lodash';

import { PartiEnvironment } from '../config/constant';
import { UserData } from '../providers/user-data';
import { ProfilePage } from '../pages/profile/profile';
import { User } from '../models/user';

@Directive({
  selector: '[smartBody]'
})
export class SmartBody implements AfterViewInit {

  constructor(
    private navCtrl: NavController,
    private el: ElementRef,
    private partiEnvironment: PartiEnvironment,
    private renderer: Renderer,
    private userData: UserData
  ) {}

  ngAfterViewInit() {
    _(this.el.nativeElement.getElementsByTagName("A")).each((aTag) => {
      aTag.addEventListener('click', (e) => {
        e.preventDefault();

        let element = e.target || e.srcElement;
        let url = element.href;
        if(!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
          return;
        }

        let parser = document.createElement('a');
        parser.href = url;
        let profileUrlMatched = parser.pathname.match(/\/u\/([^/]+)\/?$/);
        if(this.isApiUrl(url) && profileUrlMatched && profileUrlMatched[1]) {
          this.userData.bySlug(profileUrlMatched[1]).subscribe((user: User) => {
            this.navCtrl.push(ProfilePage, { user: user }, {animate: false});
          });

          return false;
        } else {
          new InAppBrowser(url, "_blank", "location=true");

          return false;
        }
      });
    });
  }

  isApiUrl(url: string) {
    if(this.partiEnvironment.isProxy) {
      return url.startsWith(this.partiEnvironment.originalApiBaseUrl);
    } else {
      return url.startsWith(this.partiEnvironment.apiBaseUrl);
    }
  }
}
