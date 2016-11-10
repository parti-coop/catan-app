import { Component, ViewChild } from '@angular/core';
import { Keyboard } from 'ionic-native';
import { Platform, MenuController, NavParams, Tabs, Tab, Events } from 'ionic-angular';

import { HomePage } from '../home/home';
import { PartiesPage } from '../parties/parties';
import { PartiHomePage } from '../parti-home/parti-home';
import { MessagesPage } from '../messages/messages';
import { MorePage } from '../more/more';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild('tabs') tabsRef: Tabs;
  @ViewChild('deepLinkTab') deepLinkTabRef: Tab;

  homeRoot: any = HomePage;
  partiesRoot: any = PartiesPage;
  messagesRoot: any = MessagesPage;
  moreRoot: any = MorePage;

  deepLinkPartiSlugArgs;

  constructor(
    platform: Platform,
    private menuCtrl: MenuController,
    private navParams: NavParams,
    private events: Events
  ) {
    platform.ready().then(() => {
      Keyboard.onKeyboardShow().subscribe(() => {
          document.body.classList.add('keyboard-is-open');
      });

      Keyboard.onKeyboardHide().subscribe(() => {
          document.body.classList.remove('keyboard-is-open');
      });
    });
    this.listenToDeepLiknEvents();
  }

  listenToDeepLiknEvents() {
    this.events.subscribe('tabs:parti-deeplink', (data) => {
      if(!this.deepLinkTabRef.root) {
        this.deepLinkTabRef.root = PartiHomePage;
        this.deepLinkTabRef.rootParams = data[0];
        this.tabsRef.select(this.deepLinkTabRef);
      } else {
        console.log(JSON.stringify(data[0]));
        this.deepLinkTabRef.setRoot(PartiHomePage, data[0]).then(() => {
          this.tabsRef.select(this.deepLinkTabRef);
        })
      }

    });
  }
}
