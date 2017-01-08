import { Component, ViewChild } from '@angular/core';
import { Platform, Content, NavController, NavParams, TextArea, LoadingController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Keyboard } from 'ionic-native';
import { Subscription } from 'rxjs/rx';

import _ from 'lodash';

import 'rxjs/add/operator/finally';

import { PartiPostPanelComponent } from '../../components/parti-post-panel/parti-post-panel';

import { CommentData } from '../../providers/comment-data';
import { PostData } from '../../providers/post-data';

import { Parti } from '../../models/parti';
import { Post } from '../../models/post';
import { Comment } from '../../models/comment';
import { PartiHomePage } from '../../pages/parti-home/parti-home';

@Component({
  selector: 'page-post',
  templateUrl: 'post.html'
})
export class PostPage {
  @ViewChild('content') content: Content;
  @ViewChild('inputCommentBody') inputCommentBody: TextArea;
  @ViewChild(PartiPostPanelComponent) partiPostPanel: PartiPostPanelComponent;

  post: Post;
  comment: Comment;
  commentForm: FormGroup;
  private onShowSubscription: Subscription;
  private onHideSubscription: Subscription;

  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    private formBuilder: FormBuilder,
    private platform: Platform,
    private postData: PostData,
    private commentData: CommentData,
    private loadingCtrl: LoadingController
  ){
    this.post = navParams.get('post');

    this.commentForm = this.formBuilder.group({
      body: ['', Validators.required]
    });

    if(platform.ready()) {
      Keyboard.disableScroll(true);
    }
  }

  ionViewDidLoad() {
    if(!this.post.full) {
      this.postData.get(this.post.id).subscribe((post) => {
        this.post = post;
      });
    }

    let comment = this.navParams.get('comment');
    this.setMentionCommentBody(comment);
  }

  loadMoreComments(infiniteScroll) {
    this.partiPostPanel.loadComments(() => {
      infiniteScroll.complete();
      if(!this.partiPostPanel.hasMoreComment) {
        infiniteScroll.enable(false);
      }
    });
  }

  setFocusCommentForm(event = null) {
    if(event && event.comment) {
      this.setMentionCommentBody(event.comment);
    }
    this.inputCommentBody.setFocus();
  }

  setMentionCommentBody(comment) {
    console.log(comment);
    if(comment) {
      let endsWithSpace = (/\s+$/.test(this.commentForm.value.body));
      let merged = _.compact([this.commentForm.value.body, `@${comment.user.nickname}`]).join(endsWithSpace ? '': ' ');
      this.commentForm.controls['body'].setValue(`${merged} `);
    }
  }

  ngOnDestroy() {
    if (this.onShowSubscription) {
      this.onShowSubscription.unsubscribe();
    }
    if (this.onHideSubscription) {
      this.onHideSubscription.unsubscribe();
    }
  }

  ionViewDidEnter() {
    if(this.navParams.get('needFocusCommentInut')) {
      setTimeout(() => {
        this.setFocusCommentForm();
      }, 500);
    }
  }

  save() {
    let loading = this.loadingCtrl.create();
    loading.present();

    let formValue = this.commentForm.value;
    this.commentData.create(this.post, formValue.body)
      .finally(() => {
        loading.dismiss();
      }).subscribe((comment: Comment) => {
        if(!this.post.latest_comments) {
          this.post.latest_comments = [];
        }
        this.post.latest_comments.unshift(comment);
        this.partiPostPanel.addComment(comment);
        this.post.comments_count += 1;
        this.commentForm.controls['body'].setValue(null);
      });
  }

  focusInput(input) {
    input.setFocus();
  }

  postBodyOrTitle() {
    if(!this.post) {
      return "";
    }

    return this.post.parsed_title || this.post.parsed_body;
  }

  onClickParti(parti: Parti) {
    this.navCtrl.push(PartiHomePage, { parti: parti });
  }
}
