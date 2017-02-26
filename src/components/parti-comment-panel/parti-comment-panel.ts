import { Component, Input, EventEmitter, Output } from '@angular/core';
import { NavController, AlertController, ViewController } from 'ionic-angular';

import { User } from '../../models/user';
import { Post } from '../../models/post';
import { Comment } from '../../models/comment';

import { ProfilePage } from '../../pages/profile/profile';

import { UpvoteData } from '../../providers/upvote-data';
import { MyselfData } from '../../providers/myself-data';
import { CommentData } from '../../providers/comment-data';

@Component({
  selector: 'parti-comment-panel',
  templateUrl: 'parti-comment-panel.html'
})
export class PartiCommentPanelComponent {
  @Input() comment: Comment;
  @Input() post: Post;
  @Output() onAddComment = new EventEmitter();
  @Output() onRemoveComment = new EventEmitter();

  isUpvoteLoading: boolean = false;
  exists: boolean = true;

  constructor(
    private navCtrl: NavController,
    public alertCtrl: AlertController,
    private upvoteData: UpvoteData,
    private myselfData: MyselfData,
    private commentData: CommentData
  ) {}

  onClickUser(user: User) {
    this.navCtrl.push(ProfilePage, { user: user });
  }

  onClickUpvoteButton() {
    this.isUpvoteLoading = true;
    if(this.comment.is_upvotable) {
      this.upvoteData.create(this.comment.id, 'Comment')
        .finally(() => {
          this.isUpvoteLoading = false;
        })
        .subscribe(() => {
          this.comment.is_upvotable = false;
          this.comment.upvotes_count++;
        });
    } else {
      this.upvoteData.destroy(this.comment.id, 'Comment')
        .finally(() => {
          this.isUpvoteLoading = false;
        })
        .subscribe(() => {
          this.comment.is_upvotable = true;
          this.comment.upvotes_count--;
        });
    }
  }

  onClickAddCommentButton() {
    this.onAddComment.emit({comment: this.comment});
  }

  onClickRemoveCommentButton() {
    let alert = this.alertCtrl.create({
      title: '확인',
      message: '정말 삭제하시겠습니까?',
      buttons: [
        {
          text: '취소',
          role: 'cancel'
        },
        {
          text: '삭제합니다',
          handler: () => {
            this.onRemoveComment.emit({comment: this.comment});
          }
        }
      ]
    });
    alert.present();
  }

  isMyComment(comment) {
    return comment.user.id == this.myselfData.id;
  }
}

