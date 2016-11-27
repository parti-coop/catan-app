import { Component, ViewChild } from '@angular/core';
import { NavController, Events, Refresher } from 'ionic-angular';

import moment from 'moment';
import _ from 'lodash';

import { PartiEnvironment } from '../../config/constant';
import { Message } from '../../models/message';
import { MessageData } from '../../providers/message-data';
import { PostPage } from '../../pages/post/post';
import { PartiHomePage } from '../../pages/parti-home/parti-home';

@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html'
})
export class MessagesPage {
  @ViewChild(Refresher) refresher: Refresher;

  messages: Message[];
  hasPreviousMessages: boolean = false;

  constructor(
    public navCtrl: NavController,
    public partiEnvironment: PartiEnvironment,
    private events: Events,
    private messageData: MessageData
  ) {}

  ionViewDidLoad() {
    this.loadNewest();
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
        if(newMessages.items) {
          this.messages = newMessages.items;
          this.hasPreviousMessages = newMessages.has_more_item;
          this.events.publish('tabs:last-message-id', _(this.messages).head().id);
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

  onRefresh(refresher) {
    this.loadNewest(() => {
      setTimeout(() => {
        refresher.complete();
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
