import { Component, Input, EventEmitter, Output } from '@angular/core';
import { NavController } from 'ionic-angular';

import { User } from '../../models/user';
import { Post } from '../../models/post';
import { Comment } from '../../models/comment';

import { ProfilePage } from '../../pages/profile/profile';
import { PartiReadMorePipe } from '../../pipes/parti-read-more-pipe';

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

  isUpvoteLoading: boolean = false;

  constructor(
    private navCtrl: NavController,
    // private alertCtrl: AlertController,
    // private platform: Platform,
    // private toastCtrl: ToastController,
    // private actionSheetCtrl: ActionSheetController,
    // private modalCtrl: ModalController,
    // private votingData: VotingData,
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

  onClickCommentButton() {
    this.onAddComment.emit({comment: this.comment});
  }
}

