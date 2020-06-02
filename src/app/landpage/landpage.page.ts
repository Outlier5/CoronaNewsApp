import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { HTTP } from '@ionic-native/http/ngx';
import { Storage } from '@ionic/storage';
import { Buffer } from 'buffer';

import { GlobalService } from '../global.service';

@Component({
  selector: 'app-landpage',
  templateUrl: './landpage.page.html',
  styleUrls: ['./landpage.page.scss'],
})
export class LandpagePage implements OnInit {

  constructor(
    public global: GlobalService,
    public storage: Storage,
    private navCtrl: NavController,
    private http: HTTP,
  ) {
   }

  async ngOnInit() {
    await this.storage.get('date').then(async value => {
      const date = new Date();

      if (value && date > value) {
        const { _id } = await this.storage.get('user').then(val => val);

        const token = await this.storage.get('token').then(val => val);

        this.http.get(`http://outlier5-com.umbler.net/auth/revokeToken/${ _id }`, {}, {
          'Authorization': `Bearrer ${token}`
        })
          .then(data => {
            const { user, token } = JSON.parse(data.data); 
            const date = new Date();

            this.storage.set('token', token);
            this.storage.set('date', date.setHours(date.getHours() + 24));
            this.storage.set('user', user);

            this.global.userGlobal = user;
            this.global.avatar = `data:image/webp;base64,${Buffer.from(user.avatar).toString('base64')}`;
            this.global.loged = true;
            this.navCtrl.navigateRoot('/home');
          }).catch(err => {
            const { error } = JSON.parse(err.error);
            this.global.toast(error);
          })
      } else {
        await this.storage.get('token').then(value => {
          if (value) {
            this.storage.get('user').then(val => {
              this.global.userGlobal = val;
              this.global.avatar = `data:image/webp;base64,${Buffer.from(val.avatar).toString('base64')}`;
              this.global.loged = true;
              this.navCtrl.navigateRoot('/home');
            });
          } else {
            this.storage.get('firstTime').then(async (value) => {
              if (!value) {
                this.global.userGlobal = { name: 'Visitante' };
                this.global.avatar = '../../assets/outlier.jpeg';
                this.global.loged = false;
                this.navCtrl.navigateRoot('/welcome');
              } else {
                this.global.userGlobal = { name: 'Visitante' };
                this.global.avatar = '../../assets/outlier.jpeg';
                this.global.loged = false;
                this.navCtrl.navigateRoot('/home');
              }
            });
          }
        });
      }
    });
  }

}
