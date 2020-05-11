import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { HTTP } from '@ionic-native/http/ngx';
import { Storage } from '@ionic/storage';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';

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
  public isSubmitted = false;

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
      email: ['', [Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
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
    this.storage.get('token').then(async value => { 
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

      await fileTransfer.upload(this.toUploadAvatar, 'http://outlier5-com.umbler.net/options/avatarUpload', options)
        .then(async data => {
          this.global.avatar = await this.avatar;
          const { user } = await JSON.parse(data.response);
          await this.storage.set('user', user);
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

  async cancel() {
    this.avatar = await this.global.avatar;
    this.acceptButton = false;
  }

  submit(){
    this.isSubmitted = true;

    if (!this.optionsForm.valid) {
      this.global.toast('Por favor insira todos valores requeridos');
      return false;
    } else {
      this.storage.get('token').then(value => {
        this.http.put('http://outlier5-com.umbler.net/options/updateProfile', this.optionsForm.value, {
        'Authorization': `Bearrer ${value}`
        })
          .then(data => {
            const { name, email } = this.optionsForm.value;
            this.global.userGlobal.name = name == '' ? this.global.userGlobal.name : name;
            this.global.userGlobal.email = email == '' ? this.global.userGlobal.email : email;

            const { token, user, message } = JSON.parse(data.data);
            this.storage.set('token', token);
            this.storage.set('user', user);
            this.global.toast(message);
          }).catch(err => {
            const { error } = JSON.parse(err.error);
            this.global.toast(error);
          });
      });
    }
  }

  back() {
    this.router.navigate(['/home']);
  }

}
