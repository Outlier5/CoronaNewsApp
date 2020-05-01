import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { HTTP } from '@ionic-native/http/ngx';
import { Storage } from '@ionic/storage';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { Buffer } from 'buffer';

import { GlobalService } from '../global.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.page.html',
  styleUrls: ['./options.page.scss'],
})
export class OptionsPage implements OnInit {

  public optionsForm: any;
  public avatar: any;
  public toUploadAvatar: any;

  public acceptButton: boolean = false;
  public loading: boolean = false;

  constructor(
    public global: GlobalService,
    public formBuilder: FormBuilder,
    public storage: Storage,
    public router: Router,
    private http: HTTP,
    private webview: WebView,
    private imagePicker: ImagePicker,
    private transfer: FileTransfer,
  ) { 
    this.optionsForm = formBuilder.group({
      name: [''],
      email: [''],
      password: [''],
    });
  }

  ngOnInit() {
  }

  getImage() {
    this.imagePicker.getPictures({ 
      quality: 100,
      maximumImagesCount: 1,
      outputType: 0,
      width: 800,
      height: 600}).then((results) => {
      for (var i = 0; i < results.length; i++) {
        this.avatar = this.webview.convertFileSrc(results[i])
        this.toUploadAvatar = results[i];
        this.acceptButton = true;
      }
    }, (err) => { this.acceptButton = false; });
  }

  uploadImage() {
    this.loading = true;
    this.storage.get('token').then(value => { 
      const fileTransfer: FileTransferObject = this.transfer.create();

      let options: FileUploadOptions = {
        fileKey: 'image',
        fileName: 'image',
        chunkedMode: false,
        mimeType: "image/jpeg",
        httpMethod: 'POST',
        headers: {
          'Authorization': `Bearrer ${value}`
        }
      }

      fileTransfer.upload(this.toUploadAvatar, 'https://coronago.herokuapp.com/options/avatarUpload', options)
        .then(data => {
          this.global.avatar = this.avatar;
          const { user } = JSON.parse(data.response);
          this.storage.set('user', user);
          this.acceptButton = false;
          this.loading = false;
          this.global.toast('Foto atualizada com sucesso');
        }).catch(err => {
          const { error } = JSON.parse(err.error)
          this.loading = false;
          this.global.toast(error);
        });
    });
      
  }

  submit(){
    this.storage.get('token').then(value => {
      this.http.put('https://coronago.herokuapp.com/options/updateProfile', this.optionsForm.value, {
      'Authorization': `Bearrer ${value}`
      })
        .then(data => {
          const { name, email } = this.optionsForm.value;
          this.global.userGlobal.name = name == '' ? this.global.userGlobal.name : name;
          this.global.userGlobal.email = email == '' ? this.global.userGlobal.email : email;

          const { token, user, message } = JSON.parse(data.data);
          this.storage.set('token', token);
          this.storage.set('user', user);
          alert(message);
        }).catch(error => {
          alert(error)
          console.log(error)
        });
    });
  }
}
