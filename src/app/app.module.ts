import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Elastic } from 'angular2-elastic';

import { PartiApp } from './app.component';

import { PartiSimpleFormatPipe } from '../pipes/parti-simple-format-pipe';
import { PartiDateTimeFormatObservablePipe } from '../pipes/parti-datetime-format-observable-pipe';

import { PartiPostComponent } from '../components/parti-post/parti-post';
import { PartiPostBylineComponent } from '../components/parti-post-byline/parti-post-byline';
import { PartiUpvoteButton } from '../components/parti-upvote-button/parti-upvote-button';

import { KeyboardAttachDirective } from '../directives/keyboard-attach';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { SignInPage } from '../pages/sign-in/sign-in';
import { PostPage } from '../pages/post/post';

import { PartiEnvironment } from '../config/constant';
import { MyselfData } from '../providers/myself-data';
import { PostData } from '../providers/post-data';
import { CommentData } from '../providers/comment-data';
import { UpvoteData } from '../providers/upvote-data';
import { ApiHttp } from '../providers/api-http';

// monent settings
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
    PostPage,
    PartiPostBylineComponent,
    PartiPostComponent,
    PartiUpvoteButton,
    PartiSimpleFormatPipe,
    KeyboardAttachDirective,
    PartiDateTimeFormatObservablePipe
  ],
  imports: [
    Elastic,
    IonicModule.forRoot(PartiApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    PartiApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    SignInPage,
    PostPage
  ],
  providers: [
    PartiEnvironment,
    MyselfData,
    PostData,
    CommentData,
    UpvoteData,
    ApiHttp,
    Storage
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule {}
