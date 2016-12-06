import { Component, ViewChild } from '@angular/core';
import { Keyboard } from 'ionic-native';
import { Platform, MenuController, ModalController, NavParams, Tabs, Tab, Events } from 'ionic-angular';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { HomePage } from '../home/home';
import { EditorPage } from '../editor/editor';
import { PartiesPage } from '../parties/parties';
import { PostPage } from '../post/post';
import { PartiHomePage } from '../parti-home/parti-home';
import { MessagesPage } from '../messages/messages';
import { ProfilePage } from '../profile/profile';

import { PostData } from '../../providers/post-data';
import { MessageData } from '../../providers/message-data';
import { MyselfData } from '../../providers/myself-data';
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
  profileRoot: any = ProfilePage;

  newPostsCountLabel: string;
  newMessagesCountLabel: string;
  newMessagesCountSubscription: Subscription;

  private onShowSubscription: Subscription;
  private onHideSubscription: Subscription;

  constructor(
    private platform: Platform,
    private menuCtrl: MenuController,
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private events: Events,
    private myselfData: MyselfData,
    private postData: PostData,
    private messageData: MessageData,
    private partiData: PartiData
  ) {
    this.listenToDeepLiknEvents();
    this.listenToNewPostsCountEvents();
    this.listenToLastMessageIdEvents();
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.onShowSubscription = Keyboard.onKeyboardShow().subscribe(() => {
          document.body.classList.add('keyboard-is-open');
      });
      this.onHideSubscription = Keyboard.onKeyboardHide().subscribe(() => {
          document.body.classList.remove('keyboard-is-open');
      });

      this.newMessagesCountSubscription = this.pollingNewMessagesCount();
    });
  }

  ionViewWillUnload() {
    console.log('tabs ionViewWillUnload');
    for(var i = 0; i < this.tabsRef.length(); i++) {
      let tab = this.tabsRef.getByIndex(i);
      tab && tab.popAll();
    }
    this.newMessagesCountSubscription.unsubscribe();
    if (this.onShowSubscription) {
      this.onShowSubscription.unsubscribe();
    }
    if (this.onHideSubscription) {
      this.onHideSubscription.unsubscribe();
    }
  }

  pollingNewMessagesCount() {
    return Observable
      .interval(2 * 60 * 1000)
      .startWith(0)
      .subscribe(() => {
        let lastMessageId = this.myselfData.getLastMessageId();
        if(!lastMessageId) {
          this.messageData.lastMessageId()
            .subscribe((id) => {
              this.myselfData.setLastMessageId(id);
            });
          return;
        }
        this.messageData.newCount(lastMessageId)
          .subscribe((count) => {
            if(count && count > 0) {
              if(count > 999) {
                this.newMessagesCountLabel = '999+';
              } else {
                this.newMessagesCountLabel = String(count);
              }
              this.events.publish('messages:refresh', lastMessageId);
            } else {
              this.newMessagesCountLabel = null;
            }
          });
      });
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

  listenToNewPostsCountEvents() {
    this.events.subscribe('tabs:new-posts-count', (data) => {
      this.newPostsCountLabel = data[0];
    });
  }

  listenToLastMessageIdEvents() {
    this.events.subscribe('tabs:last-message-id', (data) => {
      this.myselfData.setLastMessageId(data[0]).subscribe((value) => {
        this.newMessagesCountLabel = null;
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

  onClickEditor() {
    let editorModal = this.modalCtrl.create(EditorPage);
    editorModal.present();
  }
}
