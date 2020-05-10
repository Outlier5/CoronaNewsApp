import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';

import { HTTP } from '@ionic-native/http/ngx';
import { Storage } from '@ionic/storage';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { BrowserTab } from '@ionic-native/browser-tab/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { GlobalService } from '../global.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  public indexTab: number = 0;
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

  public number = 5;

  constructor(
    public storage: Storage,
    public modalController: ModalController,
    public loadingController: LoadingController,
    public global: GlobalService,
    private iab: InAppBrowser,
    private browserTab: BrowserTab,
    private http: HTTP,
    private socialSharing: SocialSharing,
  ) {
  }

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Por favor, aguarde...',
      duration: 3000,
    });
    await loading.present();
    this.getBoletins('*', '*', this.pageNumber, { event: null, first: false });
  }
  

  swipe(event) {
    alert('aaa')
    if(event.direction === 2) {
      this.indexTab = 1;
    }
    if(event.direction === 4) {
      this.indexTab = 0;
    }
  }
  

  select() {
    this.loading = true;
    this.pageNumber = 1;
    this.getBoletins(this.selected, '*', this.pageNumber, { event: null, first: false });
  }

  async getBoletins(state, date, page, { event, first }) {
    
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
        }).catch((err) => {
          const { error } = JSON.parse(err.error);
          event.target.complete();
          this.global.toast(error);
        });
      });
    } catch (err) {
      console.log(err);
    }
  }

  doInfinite(event) {
    if (this.number > this.data.length)
      this.getBoletins('*', 'date', this.pageNumber, { event, first: true });
    else
      this.number += 5;
      event.target.complete();
  }

  openBrowser(url) {
    this.browserTab.isAvailable()
      .then((isAvailable: boolean) => {
        if(isAvailable) {
            this.browserTab.openUrl(encodeURI(url));
        } else {
          this.iab.create(encodeURI(url), '_system', 'hideurlbar=yes,zoom=yes');
        }
      });  
  }

  dismiss() {
    this.modalController.dismiss();
  }
  share(state, url) {
    var options = {
      message: `Boletim oficial do estado de ${state}\n\n${url}\n\nMensagem compartilhada do app Corona Hoje, baixe agora`,
      subject: 'Mensagem compartilhada do app Corona Hoje, baixe agora',
      chooserTitle: 'Escolha um App',
    };
    this.socialSharing.shareWithOptions(options);
  }
}
