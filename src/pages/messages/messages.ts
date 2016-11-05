import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { PartiEnvironment } from '../../config/constant';
import { Message } from '../../models/message';
import { MessageData } from '../../providers/message-data';
import { PostPage } from '../../pages/post/post';

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
    this.navCtrl.push(PostPage, {
      post: message.post
    });
  }
}
