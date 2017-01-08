import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Elastic } from 'angular2-elastic';

import { PartiApp } from './app.component';

import { PartiSimpleFormatPipe } from '../pipes/parti-simple-format-pipe';
import { PartiDateTimeFormatObservablePipe } from '../pipes/parti-datetime-format-observable-pipe';
import { PartiReadMorePipe } from '../pipes/parti-read-more-pipe';

import { PartiPostPanelComponent } from '../components/parti-post-panel/parti-post-panel';
import { PartiCommentPanelComponent } from '../components/parti-comment-panel/parti-comment-panel';
import { PartiPostBylineComponent } from '../components/parti-post-byline/parti-post-byline';
import { PartiList } from '../components/parti-list/parti-list';
import { JoinedPartiList } from '../components/joined-parti-list/joined-parti-list';

import { KeyboardAttachDirective } from '../directives/keyboard-attach';
import { Shrinkage } from '../directives/shrinkage';
import { SmartBody } from '../directives/smart-body';

import { MorePage } from '../pages/more/more';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { SignInPage } from '../pages/sign-in/sign-in';
import { SignUpPage } from '../pages/sign-up/sign-up';
import { PostPage } from '../pages/post/post';
import { PartiesPage } from '../pages/parties/parties';
import { GroupPartiesPage } from '../pages/group-parties/group-parties';
import { MessagesPage } from '../pages/messages/messages';
import { PartiHomePage } from '../pages/parti-home/parti-home';
import { CancelPartiMemberPage } from '../pages/cancel-parti-member/cancel-parti-member';
import { DisconnectedPage } from '../pages/disconnected/disconnected';
import { EmailInvitationPage } from '../pages/email-invitation/email-invitation';
import { NicknameInvitationPage } from '../pages/nickname-invitation/nickname-invitation';
import { OpeningPage } from '../pages/opening/opening';
import { IntroPage } from '../pages/intro/intro';
import { DevPage } from '../pages/dev/dev';
import { MembersPage } from '../pages/members/members';
import { ProfilePage } from '../pages/profile/profile';
import { EditorPage } from '../pages/editor/editor';
import { PartiSelectPage } from '../pages/parti-select/parti-select';

import { PartiEnvironment } from '../config/constant';
import { PartiData } from '../providers/parti-data';
import { GroupData } from '../providers/group-data';
import { MyselfData } from '../providers/myself-data';
import { PostData } from '../providers/post-data';
import { CommentData } from '../providers/comment-data';
import { UpvoteData } from '../providers/upvote-data';
import { VotingData } from '../providers/voting-data';
import { MessageData } from '../providers/message-data';
import { MemberData } from '../providers/member-data';
import { UserData } from '../providers/user-data';
import { InvitationData } from '../providers/invitation-data';
import { TagData } from '../providers/tag-data';
import { DeviceTokenData } from '../providers/device-token-data';
import { PushService } from '../providers/push-service';
import { ApiHttp } from '../providers/api-http';

// monent settings
import moment from 'moment';
import 'moment/src/locale/ko';
moment.locale('ko');

@NgModule({
  declarations: [
    PartiApp,
    MorePage,
    HomePage,
    TabsPage,
    SignInPage,
    SignUpPage,
    PostPage,
    PartiesPage,
    GroupPartiesPage,
    MessagesPage,
    PartiHomePage,
    CancelPartiMemberPage,
    EmailInvitationPage,
    DisconnectedPage,
    NicknameInvitationPage,
    OpeningPage,
    IntroPage,
    DevPage,
    MembersPage,
    ProfilePage,
    EditorPage,
    PartiSelectPage,
    PartiPostBylineComponent,
    PartiPostPanelComponent,
    PartiCommentPanelComponent,
    PartiList,
    JoinedPartiList,
    PartiSimpleFormatPipe,
    KeyboardAttachDirective,
    SmartBody,
    Shrinkage,
    PartiReadMorePipe,
    PartiDateTimeFormatObservablePipe
  ],
  imports: [
    Elastic,
    IonicModule.forRoot(PartiApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    PartiApp,
    MorePage,
    HomePage,
    TabsPage,
    SignInPage,
    SignUpPage,
    PostPage,
    PartiesPage,
    GroupPartiesPage,
    MessagesPage,
    PartiHomePage,
    DisconnectedPage,
    CancelPartiMemberPage,
    EmailInvitationPage,
    NicknameInvitationPage,
    OpeningPage,
    IntroPage,
    DevPage,
    MembersPage,
    ProfilePage,
    EditorPage,
    PartiSelectPage
  ],
  providers: [
    PartiEnvironment,
    MyselfData,
    PostData,
    CommentData,
    UpvoteData,
    VotingData,
    PartiData,
    GroupData,
    MessageData,
    MemberData,
    InvitationData,
    UserData,
    TagData,
    DeviceTokenData,
    PushService,
    ApiHttp,
    Storage
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule {}
