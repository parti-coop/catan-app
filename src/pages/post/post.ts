import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, TextArea } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Keyboard } from 'ionic-native';
import { Platform } from 'ionic-angular';


import { Post } from '../../models/post';

@Component({
  selector: 'page-post',
  templateUrl: 'post.html'
})
export class PostPage {
  @ViewChild('inputCommentBody') inputCommentBody: TextArea;

  post: Post;
  commentForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    private formBuilder: FormBuilder,
    private platform: Platform
  ){
    this.post = navParams.get('post');
    this.commentForm = this.formBuilder.group({
      body: ['', Validators.required]
    });

    if(platform.ready()) {
      Keyboard.disableScroll(true);
      Keyboard.onKeyboardShow().subscribe(() => {
        document.body.classList.add('keyboard-is-open');
      });

      Keyboard.onKeyboardHide().subscribe(() => {
        document.body.classList.remove('keyboard-is-open');
      });
    }
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.inputCommentBody.setFocus();
    }, 150);
  }

  save() {
    console.log("save!!!");
  }

  focusInput(input) {
    input.setFocus();
  }
}
