import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { PartiApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { SignInPage } from '../pages/sign-in/sign-in';

import { MyselfData } from '../providers/myself-data';
import { Storage } from '@ionic/storage';

import { PartiEnvironment } from '../config/constant';

@NgModule({
  declarations: [
    PartiApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    SignInPage
  ],
  imports: [
    IonicModule.forRoot(PartiApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    PartiApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    SignInPage
  ],
  providers: [
    PartiEnvironment,
    MyselfData,
    Storage
  ]
})
export class AppModule {}
