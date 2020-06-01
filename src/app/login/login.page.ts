import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';

import { HTTP } from '@ionic-native/http/ngx';
import { Storage } from '@ionic/storage';
import { Buffer } from 'buffer';

import { GlobalService } from '../global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public loginForm: any;
  public loading = false;
  public isSubmitted = false;

  constructor(
    public global: GlobalService,
    public formBuilder: FormBuilder,
    public storage: Storage,
    private navCtrl: NavController,
    private http: HTTP,
    ) {
      this.loginForm = formBuilder.group({
        email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$'), Validators.maxLength(60)]],
        password: ['', Validators.required],
      });
    }
  get errorControl() {
    return this.loginForm.controls;
  }

  ngOnInit() {
  }

  login(){
    this.isSubmitted = true;

    if (!this.loginForm.valid) {
      this.global.toast('Por favor insira todos valores requeridos');
      return false;
    } else {
      this.loading = true;
      this.http.post('http://outlier5-com.umbler.net/auth/login', {
        email: this.loginForm.value.email.trim(),
        password: this.loginForm.value.password.trim(),
      }, {})
        .then(data => {
          const { token, user, message } = JSON.parse(data.data);
          const date = new Date();

          this.storage.set('token', token);
          this.storage.set('date', date.setHours(date.getHours() + 24));
          this.storage.set('user', user);

          this.global.userGlobal = user;
          this.global.avatar = `data:image/webp;base64,${Buffer.from(user.avatar).toString('base64')}`;
          this.global.loged = true;

          this.loading = false;
          this.global.toast(message);
          this.navCtrl.navigateRoot('/landpage');
        }).catch(err => {
          const { error } = JSON.parse(err.error)
          this.loading = false;
          this.global.toast(error);
        });
    }
  }

}
