import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Elastic } from 'angular2-elastic';

import { PartiApp } from './app.component';

import { PartiSimpleFormatPipe } from '../pipes/parti-simple-format-pipe';
import { PartiDateTimeFormatObservablePipe } from '../pipes/parti-datetime-format-observable-pipe';

import { PartiPostPanelComponent } from '../components/parti-post-panel/parti-post-panel';
import { PartiPostBylineComponent } from '../components/parti-post-byline/parti-post-byline';
import { PartiUpvoteButton } from '../components/parti-upvote-button/parti-upvote-button';

import { KeyboardAttachDirective } from '../directives/keyboard-attach';

import { AboutPage } from '../pages/about/about';
import { MorePage } from '../pages/more/more';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { SignInPage } from '../pages/sign-in/sign-in';
import { PostPage } from '../pages/post/post';
import { PartiesPage } from '../pages/parties/parties';

import { PartiEnvironment } from '../config/constant';
import { PartiData } from '../providers/parti-data';
import { MyselfData } from '../providers/myself-data';
import { PostData } from '../providers/post-data';
import { CommentData } from '../providers/comment-data';
import { UpvoteData } from '../providers/upvote-data';
import { VotingData } from '../providers/voting-data';
import { ApiHttp } from '../providers/api-http';

// monent settings
import moment from 'moment';
import 'moment/src/locale/ko';
moment.locale('ko');

@NgModule({
  declarations: [
    PartiApp,
    AboutPage,
    MorePage,
    HomePage,
    TabsPage,
    SignInPage,
    PostPage,
    PartiesPage,
    PartiPostBylineComponent,
    PartiPostPanelComponent,
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
    MorePage,
    HomePage,
    TabsPage,
    SignInPage,
    PostPage,
    PartiesPage
  ],
  providers: [
    PartiEnvironment,
    MyselfData,
    PostData,
    CommentData,
    UpvoteData,
    VotingData,
    PartiData,
    ApiHttp,
    Storage
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule {}
