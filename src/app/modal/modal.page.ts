import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { HTTP } from '@ionic-native/http/ngx';
import { Storage } from '@ionic/storage';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { GlobalService } from '../global.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  public selectStateForm: any;
  public loading: boolean = false;
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

  public data = [];
  public pageNumber = 1;

  constructor(
    public storage: Storage,
    public modalController: ModalController,
    public global: GlobalService,
    private iab: InAppBrowser,
    private http: HTTP,
  ) {
  }

  ngOnInit() {
    this.getBoletins('*', '*', this.pageNumber, { event: null, first: false });
  }

  select() {
    this.loading = true;
    this.pageNumber = 1;
    this.getBoletins(this.selected, '*', this.pageNumber, { event: null, first: false });
  }

  getBoletins(state, date, page, { event, first }) {
    try {
      this.storage.get('token').then(value => {
        this.http.get(`https://coronago.herokuapp.com/coronaApi/getBoletins/${state}/${date}/${page}`, {}, {
          'Authorization': `Bearrer ${value}`
        }).then(data => {
          const results = JSON.parse(data.data).results;

          if (!first)
            this.data = [];

          results.forEach(element => {
            const pdfCheck = element.url.split('/').reverse()[0];
    
            if (pdfCheck.split('.').reverse()[0] == 'pdf')
              this.data.push({ ...element, isPDF: true });
            else
              this.data.push({ ...element, isPDF: false });
          });

          if (first)
            event.target.complete();

          this.pageNumber ++;
          this.loading = false;
        });
      });
    } catch (error) {
      this.global.toast(error);
    }
  }

  doInfinite(event) {
    this.getBoletins('*', 'date', this.pageNumber, { event, first: true });
  }

  openBrowser(url) {
    const pdfCheck = url.split('/').reverse()[0];
    
    if (pdfCheck.split('.').reverse()[0] == 'pdf')
      this.iab.create(encodeURI(url), '_system', 'hideurlbar=yes,zoom=no');
    else
      this.iab.create(encodeURI(url), '_self', 'hideurlbar=yes,zoom=no');
  }

  dismiss() {
    this.modalController.dismiss();
  }

}
