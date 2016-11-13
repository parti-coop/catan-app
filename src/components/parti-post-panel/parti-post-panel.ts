import { Platform } from 'ionic-angular';
import { Component, Input } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { InAppBrowser, Transfer, FileOpener } from 'ionic-native';

import _ from 'lodash';

import 'rxjs/add/operator/finally';

import { LinkSource } from '../../models/link-source';
import { FileSource } from '../../models/file-source';
import { User } from '../../models/user';
import { Post } from '../../models/post';
import { PostPage } from '../../pages/post/post';

import { VotingData } from '../../providers/voting-data';
import { MyselfData } from '../../providers/myself-data';

declare var cordova: any;

@Component({
  selector: 'parti-post-panel',
  templateUrl: 'parti-post-panel.html'
})
export class PartiPostPanelComponent {
  @Input()
  post: Post;

  @Input()
  isCollection: boolean;

  disableVotingButtons: boolean = false;

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private platform: Platform,
    private votingData: VotingData,
    private myselfData: MyselfData
  ) {}

  isAgreed() {
    return this.post.poll.my_choice === "agree";
  }

  isDisagreed() {
    return this.post.poll.my_choice === "disagree";
  }

  isVoted() {
    return !!this.post.poll.my_choice;
  }

  isImage() {
    return this.post.file_reference.file_type.startsWith("image");
  }

  onClickCommentButton() {
    this.navCtrl.push(PostPage, {
      post: this.post,
      needFocusCommentInut: true
    });
  }

  onClickLinkReference(linkSource: LinkSource) {
    this.platform.ready().then(() => {
      let browser = new InAppBrowser(linkSource.url, "_system", "location=true");
      browser.show();
    });
  }

  onClickFileReference(fileSource: FileSource) {
    let targetPath;
    if (this.platform.is('ios')) {
      targetPath = cordova.file.documentsDirectory + this.post.id + '/' + fileSource.attachment_filename;
    }
    else if(this.platform.is('android')) {
      targetPath = cordova.file.dataDirectory + this.post.id + '/' + fileSource.attachment_filename;
    }
    else {
      console.log("unsupported platform");
      return;
    }

    this.platform.ready().then(() => {
      const fileTransfer = new Transfer();
      var uri = encodeURI(fileSource.attachment_url);
      fileTransfer.download(uri, targetPath)
        .then(() => {
          let alertSuccess = this.alertCtrl.create({
            title: '다운로드 완료',
            subTitle: `${fileSource.name} 파일을 다운로드 했습니다. \n바로 열어 보시겠습니까?`,
            buttons: [
              {
                text: '취소',
                role: 'cancel',
                handler: data => {
                  console.log('Cancel clicked');
                }
              },
              {
                text: '열기',
                handler: () => {
                  FileOpener.open(targetPath, fileSource.file_type);
                }
              }
             ]
          });

          alertSuccess.present(alertSuccess);
        }).catch((error) => {
          console.log("PartiPostPanelComponent#onClickFileReference : " + JSON.stringify(error));
          let alert = this.alertCtrl.create({
            title: '오류',
            subTitle: '다운로드 중에 오류가 발생했습니다.',
            buttons: ['확인']
          });
          alert.present();
        });
    });
  }

  onClickVotingButton(choice: string) {
    if(this.post.poll.my_choice === choice) {
      return;
    }
    this.disableVotingButtons = true;
    this.votingData.choose(this.post.poll.id, choice).finally(() => {
        this.disableVotingButtons = false;
      }).subscribe(() => {
        if(choice === this.post.poll.my_choice) {
          return;
        }

        let antiChoice = (choice == 'agree' ? 'disagree' : 'agree');
        if(!this.isVoted()) {
          this.post.poll.votings_count++;
        } else {
          this.post.poll[`${antiChoice}d_votings_count`]--;
        }

        this.post.poll[`${choice}d_voting_users`].push(this.myselfData.asModel());
        this.post.poll[`${choice}d_votings_count`]++;
        this.post.poll[`${antiChoice}d_voting_users`] = _.reject(this.post.poll[`${antiChoice}d_voting_users`], { id: this.myselfData.id });
        this.post.poll.my_choice = choice;
      });
  }

  onClickVotingUser(user: User) {
    console.log(`user ${user.nickname}`);
  }
}
