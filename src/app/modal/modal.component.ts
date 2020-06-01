import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, LoadingController, IonSlides, IonContent } from '@ionic/angular';

import { HTTP } from '@ionic-native/http/ngx';
import { Storage } from '@ionic/storage';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { BrowserTab } from '@ionic-native/browser-tab/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { GlobalService } from '../global.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {

  public newsButtons: boolean;
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

  public slideOpts = {
    initialSlide: 0,
    autoHeight: true,
  };

  @ViewChild('conteudo', { static: false }) content: IonContent;
  @ViewChild('mySlider', { static: true }) slides: IonSlides; 
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

  ngAfterViewInit() {
    (<any>window).twttr.widgets.load();

    document.getElementById('newsDiv').ontouchstart = () => {
      document.getElementById('newsDiv').style.pointerEvents = 'none';
      setTimeout(() => {document.getElementById('newsDiv').style.pointerEvents = 'all';}, 200)
    };
  } 

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Por favor, aguarde...',
      duration: 3000,
    });
    await loading.present();
    this.getBoletins('*', '*', this.pageNumber, { event: null, first: false });
    this.changeSlide();
  }

  async changeSlide(){
    this.content.scrollToTop(200);
    switch (await this.slides.getActiveIndex()) {
      case 0:
        this.newsButtons = true;
        break;
      case 1:
        this.newsButtons = false;
        break;
    
      default:
        break;
    }
  }

  toBoletim() {
    this.slides.slideTo(1);
  }
  toTweet() {
    this.slides.slideTo(0);
  }
  
  select() {
    this.loading = true;
    this.pageNumber = 1;
    this.getBoletins(this.selected, '*', this.pageNumber, { event: null, first: false });
  }

  async getBoletins(state, date, page, { event, first }) {
    
    try {
      this.storage.get('token').then(value => {
        this.http.get(`http://outlier5-com.umbler.net/brasilIoApi/getBoletins/${state}/${date}/${page}`, {}, {
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

  async dismiss() {
    await this.modalController.dismiss();
  }
  share(state, url) {
    var options = {
      message: `Boletim oficial do estado de ${state}\n\n${url}\n\nMensagem compartilhada do app Saúde Hoje, baixe agora`,
      subject: 'Mensagem compartilhada do app Saúde Hoje, baixe agora',
      chooserTitle: 'Escolha um App',
    };
    this.socialSharing.shareWithOptions(options);
  }

}
