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
    { code: 'AC', state: 'Acre' },
    { code: 'AL', state: 'Alagoas' },
    { code: 'AP', state: 'Amapá' },
    { code: 'AM', state: 'Amazonas' },
    { code: 'BA', state: 'Bahia' },
    { code: 'CE', state: 'Ceará' },
    { code: 'ES', state: 'Espírito Santo' },
    { code: 'GO', state: 'Goiás' },
    { code: 'MA', state: 'Maranhão' },
    { code: 'MT', state: 'Mato Grosso' },
    { code: 'MS', state: 'Mato Grosso do Sul' },
    { code: 'MG', state: 'Minas Gerais' },
    { code: 'PA', state: 'Pará' },
    { code: 'PB', state: 'Paraíba' },
    { code: 'PR', state: 'Paraná' },
    { code: 'PE', state: 'Pernambuco' },
    { code: 'PI', state: 'Piauí' },
    { code: 'RJ', state: 'Rio de Janeiro' },
    { code: 'RN', state: 'Rio Grande do Norte' },
    { code: 'RS', state: 'Rio Grande do Sul' },
    { code: 'RO', state: 'Rondônia' },
    { code: 'RR', state: 'Roraima' },
    { code: 'SC', state: 'Santa Catarina' },
    { code: 'SP', state: 'São Paulo' },
    { code: 'SE', state: 'Sergipe' },
    { code: 'TO', state: 'Tocantins' },
    { code: 'DF', state: 'Distrito Federal' }
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
