import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { HTTP } from '@ionic-native/http/ngx';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-options',
  templateUrl: './options.page.html',
  styleUrls: ['./options.page.scss'],
})
export class OptionsPage implements OnInit {

  public optionsForm: any;
  public user = {};

  constructor(
    public formBuilder: FormBuilder,
    public storage: Storage,
    private http: HTTP,
  ) { 
    this.optionsForm = formBuilder.group({
      name: [''],
      email: [''],
      password: [''],
    });

    this.storage.get('user').then(value => this.user = value);

  }

  ngOnInit() {
  }

  submit(){
    this.storage.get('token').then(value => {
      this.http.put('https://coronago.herokuapp.com/options/updateProfile', this.optionsForm.value, {
      'Authorization': `Bearrer ${value}`
      })
        .then(async data => {
          const { token, user, message } = JSON.parse(data.data);
          await this.storage.set('token', token);
          await this.storage.set('user', user);
          await setTimeout(() => {alert(message)}, 2000);
        }).catch(error => {
          alert(error)
          console.log(error)
        });
    });
  }
}
