import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { HTTP } from '@ionic-native/http/ngx';
import { Storage } from '@ionic/storage';
import { Buffer } from 'buffer';

import { GlobalService } from '../global.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgotpass.page.html',
  styleUrls: ['./forgotpass.page.scss'],
})
export class ForgotPage implements OnInit {

  public forgotForm: any;

  constructor(
    public global: GlobalService,
    public formBuilder: FormBuilder,
    public storage: Storage,
    private http: HTTP,
    private router: Router
    ) {
      this.forgotForm = formBuilder.group({
        email: [''],
      });
   }

  ngOnInit() {
    this.storage.get('token').then(value => {
      if(value)
        this.storage.get('user').then(val => {
          this.global.userGlobal = val;
          this.global.avatar = `data:image/webp;base64,${Buffer.from(val.avatar).toString('base64')}`;
          this.router.navigate(['/login']);
        });
    });
  }

  forgot(){
    this.http.post('https://coronago.herokuapp.com/auth/login', this.forgotForm.value, {})
      .then(data => {
        const { token, user, message } = JSON.parse(data.data);
        this.storage.set('token', token);
        this.storage.set('user', user);
        this.global.userGlobal = user;
        this.global.avatar = `data:image/webp;base64,${Buffer.from(user.avatar).toString('base64')}`;
        alert(message);
        console.log('message')
        this.router.navigate(['/login'])
      }).catch(error => {
        alert(error)
      });
  }

}
