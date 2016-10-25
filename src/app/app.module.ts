import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { RequestOptions, XHRBackend } from '@angular/http';
import { Events } from 'ionic-angular';
import { __platform_browser_private__ } from '@angular/platform-browser';

import { PartiApp } from './app.component';

import { SafePipe } from '../pipes/safe-pipe';
import { SimpleFormatPipe } from '../pipes/simple-format-pipe';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { SignInPage } from '../pages/sign-in/sign-in';

import { PartiEnvironment } from '../config/constant';
import { MyselfData } from '../providers/myself-data';
import { PartiPostData } from '../providers/parti-post-data';
import { ApiHttp } from '../providers/api-http';

export function apiHttpFactory(
  backend: XHRBackend,
  defaultOptions: RequestOptions,
  myselfData: MyselfData,
  partiEnvironment: PartiEnvironment,
  events: Events
) {
  return new ApiHttp(
    backend,
    defaultOptions,
    myselfData,
    partiEnvironment,
    events);
}

@NgModule({
  declarations: [
    PartiApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    SignInPage,
    SafePipe,
    SimpleFormatPipe
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
    PartiPostData,
    ApiHttp,
    {
      provide: ApiHttp,
      useFactory: apiHttpFactory,
      deps: [XHRBackend, RequestOptions, MyselfData, PartiEnvironment, Events]
    },
    Storage,
    __platform_browser_private__.BROWSER_SANITIZATION_PROVIDERS
  ]
})
export class AppModule {}
