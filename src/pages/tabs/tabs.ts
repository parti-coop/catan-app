import { Component } from '@angular/core';
import { Keyboard } from 'ionic-native';
import { Platform } from 'ionic-angular';

import { HomePage } from '../home/home';
import { PartiesPage } from '../parties/parties';
import { MessagesPage } from '../messages/messages';
import { MorePage } from '../more/more';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  homeRoot: any = HomePage;
  partiesRoot: any = PartiesPage;
  messagesRoot: any = MessagesPage;
  moreRoot: any = MorePage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      Keyboard.onKeyboardShow().subscribe(() => {
          document.body.classList.add('keyboard-is-open');
      });

      Keyboard.onKeyboardHide().subscribe(() => {
          document.body.classList.remove('keyboard-is-open');
      });
    });
  }
}
