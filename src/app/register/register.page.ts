import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { HTTP } from '@ionic-native/http/ngx';
import { Storage } from '@ionic/storage';
import { Buffer } from 'buffer';

import { GlobalService } from '../global.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  public registerForm: any;
  public loading: boolean = false;
  public isSubmitted = false;

  constructor(
    public global: GlobalService,
    public formBuilder: FormBuilder,
    public storage: Storage,
    private http: HTTP,
    private router: Router
    ) {
      this.registerForm = formBuilder.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
        password: ['', Validators.required],
      });
  }

  get errorControl() {
    return this.registerForm.controls;
  }

  ngOnInit() {
  }

  register(){
    this.isSubmitted = true;

    if (!this.registerForm.valid) {
      this.global.toast('Por favor insira todos valores requeridos');
      return false;
    } else {
      this.loading = true;
      this.http.post('http://outlier5-com.umbler.net/auth/register', {
        name: this.registerForm.value.name.trim(),
        email: this.registerForm.value.email.trim(),
        password: this.registerForm.value.password.trim(),
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
          this.router.navigate(['/home'])
        }).catch(err => {
          const { error } = JSON.parse(err.error)
          this.loading = false;
          this.global.toast(error);
        });
    }
  }

  back() {
    this.router.navigate(['/login']);
  }

}
