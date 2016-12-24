import { Component, ViewChild } from '@angular/core';
import { NavController, Events, Refresher, Content, ViewController } from 'ionic-angular';
import { trigger, state, style, transition, animate } from '@angular/core';

import moment from 'moment';
import _ from 'lodash';

import { PartiEnvironment } from '../../config/constant';
import { Message } from '../../models/message';
import { MessageData } from '../../providers/message-data';
import { PostPage } from '../../pages/post/post';
import { PartiHomePage } from '../../pages/parti-home/parti-home';

@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
  animations: [
    trigger('messageTrigger', [
      state('visible', style({
        opacity: 1
      })),
      transition('void => *', [
        style({
          opacity: 0
        }),
        animate('200ms 300ms ease-in')
      ]),
      transition('* => void', [
        animate('200ms'),
        style({
          opacity: 0
        }),
      ])
    ])
  ]
})
export class MessagesPage {
  MESSAGES_TAB_INDEX = 3;
  REFRESHABLE_SCROLL_TOP = 10;

  @ViewChild(Refresher) refresher: Refresher;
  @ViewChild(Content) content: Content;

  messages: Message[];
  hasPreviousMessages: boolean = false;
  needToRefresh: boolean = false;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public partiEnvironment: PartiEnvironment,
    private events: Events,
    private messageData: MessageData
  ) {}

  ionViewDidLoad() {
    this.loadNewest(() => {
      this.sendLastMessageIdEventToTabs();
    });
    this.listenToRefreshEvents();
  }

  ngAfterViewInit() {
    this.content.ionScroll.subscribe((event) => {
      this.onPageScroll(event);
    });
  }

  ionViewDidEnter() {
    if(!this.needToRefresh) {
      this.sendLastMessageIdEventToTabs();
    }
  }

  listenToRefreshEvents() {
    this.events.subscribe('messages:refresh', (lastMessageId) => {
      let selectedMessagesTab = this.navCtrl.parent.getSelected().index == this.MESSAGES_TAB_INDEX;
      if(selectedMessagesTab && this.navCtrl.isActive(this.viewCtrl)) {
        console.log("nonono");
        if(this.isRefreshableScrollTop()) {
          this.loadNewest(() => {
            this.sendLastMessageIdEventToTabs();
          });
        } else {
          this.needToRefresh = true;
        }
      } else {
        if(_(this.messages).head() && _(this.messages).head().id != lastMessageId) {
          console.log('scroll to top in messages')
          this.content.scrollToTop();
          this.loadNewest();
        }
      }
    });
  }

  private onPageScroll(event) {
    if(this.needToRefresh && this.isRefreshableScrollTop()) {
      this.loadNewest(() => {
        this.sendLastMessageIdEventToTabs();
      });
      this.needToRefresh = false;
    }
  }

  private isRefreshableScrollTop() {
    return this.content.scrollTop <= this.REFRESHABLE_SCROLL_TOP;
  }

  loadNewest(onCompleted: () => void = null) {
    this.messageData.inbox()
      .finally(() => {
        onCompleted && onCompleted();
      }).subscribe(newMessages => {
        if(this.messages == null) {
          this.messages = [];
          this.hasPreviousMessages = newMessages.has_more_item;
        }
        if(!!newMessages.items) {
          let currentFirstMessage = _(this.messages).head();
          let lastNewMessage = _(newMessages.items).last();
          if(!!currentFirstMessage && !!lastNewMessage && currentFirstMessage.id > lastNewMessage.id) {
            _(newMessages.items).reverse().each((newMessage) => {
              if(currentFirstMessage.id < newMessage.id) {
                this.messages.unshift(newMessage);
              }
            });
          } else {
            this.messages = newMessages.items;
            this.hasPreviousMessages = newMessages.has_more_item;
          }
        }
      });
  }

  loadMore(infiniteScroll) {
    this.messageData.inbox(_.last(this.messages))
      .finally(() => {
        infiniteScroll.complete();
        if(!this.hasPreviousMessages) {
          infiniteScroll.enable(false);
        }
      }).subscribe(pagedMessages => {
        this.hasPreviousMessages = pagedMessages.has_more_item;
        if(this.messages == null) {
          this.messages = [];
        }
        this.messages = this.messages.concat(pagedMessages.items);
      });
  }

  sendLastMessageIdEventToTabs() {
    if(!_.isEmpty(this.messages)) {
      this.events.publish('tabs:last-message-id', _(this.messages).head().id);
    }
  }

  onRefresh(refresher) {
    this.loadNewest(() => {
      setTimeout(() => {
        refresher.complete();
        this.sendLastMessageIdEventToTabs();
      }, 500);
    });
  }

  onClickMessage(message: Message) {
    this.messageData.touchReadAt(message)
      .subscribe(() => {
        message.read_at = moment().toISOString();
      });
    if(message.messagable_type === 'Upvote' || message.messagable_type === 'Comment'){
      this.navCtrl.push(PostPage, {
        post: message.post
      });
    }
    else {
      this.navCtrl.push(PartiHomePage, {
        parti: message.parti
      });
    }
  }
}
