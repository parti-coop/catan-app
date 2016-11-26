import { Component, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { LoadingController, NavController,
  Events, ViewController, Platform, TextArea,
  ModalController, Content, AlertController } from 'ionic-angular';
import { NativeStorage, Camera, Clipboard } from 'ionic-native';

import 'rxjs/add/operator/finally';

import { Parti } from '../../models/parti';
import { Post } from '../../models/post';
import { PostData } from '../../providers/post-data';
import { PartiData } from '../../providers/parti-data';
import { MyselfData } from '../../providers/myself-data';
import { PartiSelectPage } from '../../pages/parti-select/parti-select';

export enum ReferenceType {
  FileSource,
  LinkSource,
  Poll
}

@Component({
  selector: 'page-editor',
  templateUrl: 'editor.html'
})
export class EditorPage {
  STORAGE_REFERENCE_LAST_CLIPPED_LINK = 'EditorPage_lastClippedLink';

  @ViewChild('content') content: Content;
  @ViewChild('inputBody') inputBody: TextArea;

  imageSrc: string;
  postForm: FormGroup;
  parties: Parti[];
  parti: Parti;

  referenceTypeEnum: ReferenceType;
  referenceType: ReferenceType;

  constructor(
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    private events: Events,
    private viewController: ViewController,
    private platform: Platform,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private postData: PostData,
    private partiData: PartiData,
    public myselfData: MyselfData
  ) {
    this.postForm = this.formBuilder.group({
      body: ['', Validators.required],
      link: [''],
      poll: ['']
    });
  }

  ionViewDidLoad() {
    this.partiData.joined(this.  myselfData.asModel()).subscribe((parties: Parti[]) => {
      this.parties = parties;
    });
  }

  ionViewDidEnter() {
    this.registerBackButtonListener();
    this.platform.ready().then(() => {
      NativeStorage.getItem(this.STORAGE_REFERENCE_LAST_CLIPPED_LINK).then(
        (lastClippedLink) => {
          this.initLink(lastClippedLink);
        },
        (error) => {
          this.initLink();
        }
      );

    });
  }

  initLink(lastClippedLink: string = null) {
    Clipboard.paste()
      .then((currentClippedLink: string) => {
        if(!!currentClippedLink && lastClippedLink != currentClippedLink) {
          this.postForm.controls['link'].setValue(currentClippedLink);
          NativeStorage.setItem(this.STORAGE_REFERENCE_LAST_CLIPPED_LINK, currentClippedLink);
        }
      },
      (reject: string) => {
      });
  }

  registerBackButtonListener() {
    this.platform.registerBackButtonAction(() => {
      this.viewController.dismiss();
    });
  }

  invalidToSave() {
    return !this.parti || !this.postForm.valid;
  }

  onClickPartiSelect() {
    let partiModal = this.modalCtrl.create(PartiSelectPage, { parties: this.parties, parti: this.parti });
    partiModal.onDidDismiss(data => {
      if(!!data && !!data.parti) {
        this.parti = data.parti;
      }
    });
    partiModal.present();
  }

  save() {
    let loading = this.loadingCtrl.create();
    loading.present();

    let formValue = this.postForm.value;
    this.postData.create(this.parti, formValue.body,
      (this.referenceType == ReferenceType.FileSource ? this.imageSrc : null),
      (this.referenceType == ReferenceType.LinkSource ? formValue.link : null),
      (this.referenceType == ReferenceType.Poll ? formValue.poll : null))
      .finally(() => {
        loading.dismiss();
      }).subscribe((post: Post) => {
        this.events.publish('home:reload');
        this.viewController.dismiss();
      });
  }

  onClickGallery(){
    let options = {
      maximumImagesCount: 1,
      quality: 75,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: Camera.MediaType.PICTURE,
      destinationType: Camera.DestinationType.DATA_URL
    }

    this.platform.ready().then(() => {
      Camera.getPicture(options).then((imageData) => {
        this.resetForm(ReferenceType.FileSource);
        this.imageSrc = 'data:image/jpeg;base64,' + imageData;
      }, (err) => {
        let alert = this.alertCtrl.create({
          title: '오류',
          subTitle: '엇! 뭔가 잘못되었습니다.',
          buttons: ['확인']
        });
        alert.present();
      });
    });
  }

  onClickCamera(){
    let options = {
      maximumImagesCount: 1,
      quality: 75,
      sourceType: Camera.PictureSourceType.CAMERA,
      mediaType: Camera.MediaType.PICTURE,
      destinationType: Camera.DestinationType.DATA_URL
    }

    this.platform.ready().then(() => {
      Camera.getPicture(options).then((imageData) => {
        this.resetForm(ReferenceType.FileSource);
        this.imageSrc = 'data:image/jpeg;base64,' + imageData;
      }, (err) => {
        let alert = this.alertCtrl.create({
          title: '오류',
          subTitle: '엇! 뭔가 잘못되었습니다.',
          buttons: ['확인']
        });
        alert.present();
      });
    });
  }

  onClickLink() {
    this.resetForm(ReferenceType.LinkSource);
  }

  onClickPoll() {
    this.resetForm(ReferenceType.Poll);
  }

  resetForm(referenceType: ReferenceType) {
    this.referenceType = referenceType;
  }

  referenceTypeName() {
    return ReferenceType[this.referenceType];
  }
}