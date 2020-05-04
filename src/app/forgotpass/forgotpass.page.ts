import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { HTTP } from '@ionic-native/http/ngx';
import { Storage } from '@ionic/storage';

import { GlobalService } from '../global.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgotpass.page.html',
  styleUrls: ['./forgotpass.page.scss'],
})
export class ForgotPage implements OnInit {

  public forgotForm: any;
  public isSubmitted = false;

  constructor(
    public global: GlobalService,
    public formBuilder: FormBuilder,
    public storage: Storage,
    private http: HTTP,
    private router: Router
    ) {
      this.forgotForm = formBuilder.group({
        email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      });
   }

  ngOnInit() {
  }

  get errorControl() {
    return this.forgotForm.controls;
  }

  back() {
    this.router.navigate(['/login']);
  }

  forgot(){
    this.isSubmitted = true;

    if (!this.forgotForm.valid) {
      this.global.toast('Por favor insira todos valores requeridos');
      return false;
    } else {
      this.http.post('https://coronago.herokuapp.com/auth/forgot_password', {
        email: this.forgotForm.value.email.trim(),
      }, {})
        .then(data => {
          const { success } = JSON.parse(data.data);
          this.global.toast(success);
          this.router.navigate(['/login']);
        }).catch(err => {
          const { error } = JSON.parse(err.error)
          console.log(err)
          this.global.toast(error);
        });
    }
  }

}
