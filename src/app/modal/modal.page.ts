import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { HTTP } from '@ionic-native/http/ngx';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  public selectStateForm: any;
  public states = [
    { code: 'AL', state: 'Alagoas' }
  ];
  public selected = '';

  public data: any;

  constructor(
    public storage: Storage,
    public modalController: ModalController,
    private http: HTTP,
  ) {
  }

  ngOnInit() {
    this.getBoletins('*', '*');
  }

  select() {
    this.getBoletins(this.selected, '*');
  }

  getBoletins(state, date) {
    try {
      this.storage.get('token').then(value => {
        this.http.get(`https://coronago.herokuapp.com/coronaApi/getBoletins/${state}/${date}`, {}, {
          'Authorization': `Bearrer ${value}`
        }).then(data => {
          this.data = JSON.parse(data.data).results;
        
        });
      });
    } catch (error) {
      alert(error)
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }

}
