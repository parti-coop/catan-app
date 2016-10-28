import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { PartiApp } from './app.component';

import { PartiSimpleFormatPipe } from '../pipes/parti-simple-format-pipe';
import { PartiDateTimeFormatObservablePipe } from '../pipes/parti-datetime-format-observable-pipe';

import { PartiPostByline } from '../components/parti-post-byline/parti-post-byline';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { SignInPage } from '../pages/sign-in/sign-in';

import { PartiEnvironment } from '../config/constant';
import { MyselfData } from '../providers/myself-data';
import { PostData } from '../providers/post-data';
import { ApiHttp } from '../providers/api-http';

import moment from 'moment';
import 'moment/src/locale/ko';
moment.locale('ko');

@NgModule({
  declarations: [
    PartiApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    SignInPage,
    PartiPostByline,
    PartiSimpleFormatPipe,
    PartiDateTimeFormatObservablePipe
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
    PostData,
    ApiHttp,
    Storage
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule {}
