import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams,
  InfiniteScroll, ToastController, PopoverController, Events,
  ActionSheetController, ModalController, AlertController } from 'ionic-angular';
import { Facebook, SocialSharing, InAppBrowser, AppAvailability, Device } from 'ionic-native';

import 'rxjs/add/operator/mergeMap';

import { Parti } from '../../models/parti';
import { Post } from '../../models/post';
import { CancelPartiMemberPage } from '../../pages/cancel-parti-member/cancel-parti-member';
import { EmailInvitationPage } from '../../pages/email-invitation/email-invitation';
import { NicknameInvitationPage } from '../../pages/nickname-invitation/nickname-invitation';
import { PostData } from '../../providers/post-data';
import { PartiData } from '../../providers/parti-data';
import { MemberData } from '../../providers/member-data';
import { MembersPage } from '../../pages/members/members';

declare var KakaoTalk;

@Component({
  selector: 'page-parti-home',
  templateUrl: 'parti-home.html'
})
export class PartiHomePage {
  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;

  posts: Post[];
  lastPost: Post;
  hasMoreData: boolean = true;
  isLoading: boolean = false;

  parti: Parti;

  constructor(
    public navCtrl: NavController,
    private toastCtrl: ToastController,
    public popoverCtrl: PopoverController,
    private navParams: NavParams,
    private events: Events,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private partiData: PartiData,
    private postData: PostData,
    private memberData: MemberData
  ) {
    this.parti = navParams.get('parti');
  }

  ionViewDidLoad() {
    if(this.parti) {
      this.load(() => {
        this.disableInfiniteScrollIfNoMoreData(this.infiniteScroll);
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
        this.updateIsLoading();
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

  updateIsLoading() {
    this.isLoading = (!this.parti || !this.posts);
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
      title: `${this.parti.title}에 초대합니다`,
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

  onClickShare() {
    if(!this.parti) {
      return;
    }

    let successHandler = () => {
      let toast = this.toastCtrl.create({
        message: '공유되었습니다.',
        duration: 3000
      });
      toast.present();
    }
    let failHandler = (error) => {
      if(error['errorMessage'] == 'User cancelled dialog') {
        return;
      }
      let alert = this.alertCtrl.create({
        title: '오류',
        subTitle: '아! 뭔가 잘못되었습니다.',
        buttons: ['확인']
      });
      alert.present();
    }

    let share = this.parti.share;
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [{
          text: '페이스북으로 공유',
          handler: () => {
            SocialSharing.shareViaFacebook("", "", share.url)
              .then(successHandler)
              .catch(() => {
                Facebook.showDialog({
                  method: "share",
                  href: share.url
                }).then(successHandler).catch(failHandler);
              });
          }
        },{
          text: '트위터로 공유',
          handler: () => {
            SocialSharing.shareViaTwitter(share.twitter_text, "", share.url)
              .then(successHandler)
              .catch(() => {
                let text = share.twitter_text;
                let tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(share.url)}`
                let browser = new InAppBrowser(tweetUrl, "_blank");
              });
          }
        },{
          text: '카카오톡으로 공유',
          handler: () => {
            var app = null;
            if (Device.device.platform === 'iOS') {
              app = 'kakaolink://';
            } else if (Device.device.platform === 'Android') {
              app = 'com.kakao.talk';
            }

            AppAvailability.check(app).then(
              (yes: boolean) => {
                var data = {
                  text: share.kakaotalk_text,
                  weblink: {
                    url: share.url,
                    text: share.kakaotalk_link_text,
                  },
                  applink: {
                    url: share.url,
                    text: share.kakaotalk_link_text,
                  }
                };
                if(!!share.kakaotalk_image_url && !!share.kakaotalk_image_width && !!share.kakaotalk_image_height) {
                  data["image"] = {
                    src: share.kakaotalk_image_url,
                    width: share.kakaotalk_image_width,
                    height: share.kakaotalk_image_height,
                  };
                }
                data
                KakaoTalk.share(data,
                  (success) => successHandler,
                  (error) => failHandler);
              },
              () => {
                console.log("XXX");
                let alert = this.alertCtrl.create({
                  title: '확인',
                  subTitle: `카카오톡 앱이 없습니다.`,
                  buttons: ['확인']
                });
                alert.present();
              }
            );
          }
        },{
          text: '취소',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }]
    });
    actionSheet.present();
  }

  onClickMember() {
    let profileModal = this.modalCtrl.create(MembersPage, { parti: this.parti });
    profileModal.present();
  }
}
