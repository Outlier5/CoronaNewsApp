import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { HTTP } from '@ionic-native/http/ngx';
import { Storage } from '@ionic/storage';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';


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
    private iab: InAppBrowser,
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

  openBrowser(url) {
    this.iab.create(encodeURI(url), '_self', 'hideurlbar=yes,zoom=no');
  }

  dismiss() {
    this.modalController.dismiss();
  }

}
