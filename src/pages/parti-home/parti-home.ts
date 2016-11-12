import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams,
  InfiniteScroll, ToastController, PopoverController, Events, ActionSheetController } from 'ionic-angular';

import 'rxjs/add/operator/mergeMap';

import { Parti } from '../../models/parti';
import { Post } from '../../models/post';
import { CancelPartiMemberPage } from '../../pages/cancel-parti-member/cancel-parti-member';
import { EmailInvitationPage } from '../../pages/email-invitation/email-invitation';
import { NicknameInvitationPage } from '../../pages/nickname-invitation/nickname-invitation';
import { PostData } from '../../providers/post-data';
import { PartiData } from '../../providers/parti-data';
import { MemberData } from '../../providers/member-data';

@Component({
  selector: 'page-parti-home',
  templateUrl: 'parti-home.html'
})
export class PartiHomePage {
  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;

  posts: Post[];
  lastPost: Post;
  hasMoreData: boolean = true;

  parti: Parti;
  deepLinkPartiSlug: string;

  constructor(
    public navCtrl: NavController,
    private toastCtrl: ToastController,
    public popoverCtrl: PopoverController,
    private navParams: NavParams,
    private events: Events,
    private actionSheetCtrl: ActionSheetController,
    private partiData: PartiData,
    private postData: PostData,
    private memberData: MemberData
  ) {
    this.parti = navParams.get('parti');
    this.deepLinkPartiSlug = navParams.get('deepLinkPartiSlug');
  }

  ionViewDidLoad() {
    if(this.parti) {
      this.load(() => {
        this.disableInfiniteScrollIfNoMoreData(this.infiniteScroll);
      });
    }
  }

  ionViewDidEnter() {
    if(!this.parti && !!this.deepLinkPartiSlug) {
      this.partiData.get(this.deepLinkPartiSlug)
        .subscribe((parti: Parti) => {
          this.parti = parti;
          this.deepLinkPartiSlug = null;
          this.load(() => {
            this.disableInfiniteScrollIfNoMoreData(this.infiniteScroll);
          });
        }, (error) => {
          this.navCtrl.parent.select(0);
        });
    }
  }

  loadMore(infiniteScroll) {
    this.load(() => {
      infiniteScroll.complete();
      this.disableInfiniteScrollIfNoMoreData(infiniteScroll);
    });
  }

  load(onCompleted: () => void = null) {
    this.postData.parti(this.parti, this.lastPost)
      .finally(() => {
        if(onCompleted) {
          onCompleted();
        }
      }).subscribe(pagedPosts => {
        this.hasMoreData = pagedPosts.has_more_item;
        if(this.posts == null) {
          this.posts = [];
        }
        this.posts = this.posts.concat(pagedPosts.items);
        if(this.posts.length) {
          this.lastPost = this.posts[this.posts.length-1];
        }
      });
  }

  private disableInfiniteScrollIfNoMoreData(infiniteScroll) {
    if(!this.hasMoreData) {
      infiniteScroll.enable(false);
    }
  }

  pageTitle() {
    if(!!this.parti) {
      return this.parti.title;
    }

    return '빠띠';
  }

  isLoading(): boolean {
    return !this.parti || !this.posts;
  }

  onClickJoinParti() {
    this.memberData.join(this.parti)
      .subscribe(() => {
        this.parti.is_member = true;
        this.events.publish('parti:join', this.parti);
        let toast = this.toastCtrl.create({
          message: '가입되었습니다.',
          duration: 3000
        });
        toast.present();
      });
  }

  onClickCancelParti() {
    this.memberData.cancel(this.parti)
      .subscribe(() => {
        this.parti.is_member = false;
        this.events.publish('parti:cancel', this.parti);
        let toast = this.toastCtrl.create({
          message: '탈퇴되었습니다.',
          duration: 3000
        });
        toast.present();
      });
  }

  onClickJoinedParti(event) {
    let popover = this.popoverCtrl.create(CancelPartiMemberPage, {
      partiHomePage: this });
    popover.present({
      ev: event
    });
  }

  onClickInvitation() {
    if(!this.parti) {
      return;
    }

    let actionSheet = this.actionSheetCtrl.create({
      title: `${this.parti.title} 초대합니다`,
      buttons: [
        {
          text: '이메일로 초대',
          handler: () => {
            this.navCtrl.push(EmailInvitationPage, { parti: this.parti });
          }
        },{
          text: '빠띠회원을 초대',
          handler: () => {
            this.navCtrl.push(NicknameInvitationPage, { parti: this.parti });
          }
        },{
          text: '취소',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
}
