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
  public loading: boolean = false;
  public isSubmitted = false;

  constructor(
    public global: GlobalService,
    public formBuilder: FormBuilder,
    public storage: Storage,
    private navCtrl: NavController,
    private http: HTTP,
    ) {
      this.loginForm = formBuilder.group({
        email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
        password: ['', Validators.required],
      });
  }

  get errorControl() {
    return this.loginForm.controls;
  }

  async ngOnInit() {
    this.storage.get('date').then(async value => {
      const date = new Date();
      if (date.getFullYear() > value.getFullYear()) {
        const { _id } = await this.storage.get('user').then(val => JSON.parse(val));
        const token = await this.storage.get('token').then(val => val);

        this.http.get(`https://coronago.herokuapp.com/auth/revokeToken/${ _id }`, {}, {
          'Authorization': `Bearrer ${token}`
        })
          .then(data => {
            const { user } = JSON.parse(data.data); 
            this.global.userGlobal = user;
            this.global.avatar = `data:image/webp;base64,${Buffer.from(user.avatar).toString('base64')}`;
            this.navCtrl.navigateRoot('/home');
          })
      }
    });

    await this.storage.get('token').then(value => {
      if(value)
        this.storage.get('user').then(val => {
          this.global.userGlobal = val;
          this.global.avatar = `data:image/webp;base64,${Buffer.from(val.avatar).toString('base64')}`;

          this.navCtrl.navigateRoot('/home');
        });
    });
  }

  login(){
    this.isSubmitted = true;

    if (!this.loginForm.valid) {
      this.global.toast('Por favor insira todos valores requeridos');
      return false;
    } else {
      this.loading = true;
      this.http.post('https://coronago.herokuapp.com/auth/login', {
        email: this.loginForm.value.email.trim(),
        password: this.loginForm.value.password.trim(),
      }, {})
        .then(data => {
          const { token, user, message } = JSON.parse(data.data);

          this.storage.set('token', token);
          this.storage.set('date', new Date());
          this.storage.set('user', user);

          this.global.userGlobal = user;
          this.global.avatar = `data:image/webp;base64,${Buffer.from(user.avatar).toString('base64')}`;

          this.global.toast(message);
          this.loading = false;
          this.navCtrl.navigateRoot('/home');
        }).catch(err => {
          const { error } = JSON.parse(err.error)
          this.loading = false;
          this.global.toast(error);
        });
    }
  }

}
