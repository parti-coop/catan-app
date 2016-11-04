import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { PartiEnvironment } from '../../config/constant';
import { Message } from '../../models/message';
import { MessageData } from '../../providers/message-data';

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
        console.log(this.messages);
      })
  }

}
