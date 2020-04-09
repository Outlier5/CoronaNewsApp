import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { HTTP } from '@ionic-native/http/ngx';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public loginForm: any;

  constructor(
    public formBuilder: FormBuilder,
    public storage: Storage,
    private http: HTTP,
    private router: Router
    ) {
    this.loginForm = formBuilder.group({
      cpf: [''],
      name: [''],
      email: [''],
      password: [''],
    });
   }

  ngOnInit() {
  }

  login(){
    this.http.post('https://coronago.herokuapp.com/auth/login', this.loginForm.value, {})
      .then(data => {
        const { token, user, message } = JSON.parse(data.data);
        this.storage.set('token', token);
        this.storage.set('user', user);
        alert(message)
        this.router.navigate(['/home'])

      });
  }

}
