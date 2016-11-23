import { Component, ViewChild } from '@angular/core';
import { Keyboard } from 'ionic-native';
import { Platform, MenuController, NavParams, Tabs, Tab, Events } from 'ionic-angular';

import { HomePage } from '../home/home';
import { PartiesPage } from '../parties/parties';
import { PostPage } from '../post/post';
import { PartiHomePage } from '../parti-home/parti-home';
import { MessagesPage } from '../messages/messages';
import { MorePage } from '../more/more';
import { PostData } from '../../providers/post-data';
import { PartiData } from '../../providers/parti-data';
import { Parti } from '../../models/parti';
import { Post } from '../../models/post';

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

  constructor(
    platform: Platform,
    private menuCtrl: MenuController,
    private navParams: NavParams,
    private events: Events,
    private postData: PostData,
    private partiData: PartiData
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
      let partiSlug = data[0]
      let groupSlug = data[1]
      this.partiData.get(partiSlug, groupSlug)
        .subscribe(
          (parti: Parti) => {
            this.goToDeepLink(PartiHomePage, { parti: parti });
          }, (error) => {
            console.log(`${partiSlug} slug 빠띠가 없습니다`);
          });
    });
    this.events.subscribe('tabs:post-deeplink', (data) => {
      let postId = data[0]
      this.postData.get(postId)
        .subscribe(
          (post: Post) => {
            this.goToDeepLink(PostPage, { post: post });
          }, (error) => {
            console.log(`${postId}번 글이 없습니다`);
          });
    });
  }

  goToDeepLink(page, params) {
    if(!this.deepLinkTabRef.root) {
      this.deepLinkTabRef.root = page;
      this.deepLinkTabRef.rootParams = params;
      this.tabsRef.select(this.deepLinkTabRef);
    } else {
      this.deepLinkTabRef.setRoot(page, params).then(() => {
        this.tabsRef.select(this.deepLinkTabRef);
      });
    }
  }
}
