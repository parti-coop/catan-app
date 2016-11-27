import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import moment from 'moment';

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
  messages: Message[];

  constructor(
    public navCtrl: NavController,
    public partiEnvironment: PartiEnvironment,
    private messageData: MessageData
  ) {}

  ionViewDidLoad() {
    this.messageData.fetch()
      .subscribe((messages: Message[]) => {
        this.messages = messages;
      })
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
