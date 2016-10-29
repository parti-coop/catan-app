import { Component } from '@angular/core';
import { Keyboard } from 'ionic-native';
import { Platform } from 'ionic-angular';

import { HomePage } from '../home/home';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = AboutPage;
  tab3Root: any = ContactPage;

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
