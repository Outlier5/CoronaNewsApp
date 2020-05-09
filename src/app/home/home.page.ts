import {
  GoogleMaps,
  GoogleMap,
  GoogleMapOptions,
  Circle,
  Marker,
  Environment,
  HtmlInfoWindow,
  GoogleMapsEvent
} from '@ionic-native/google-maps/ngx';
import { Component } from '@angular/core';
import { Platform, MenuController, ModalController, LoadingController, NavController } from '@ionic/angular';
import { FormBuilder } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { Storage } from '@ionic/storage';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free/ngx';

import { ModalPage } from '../modal/modal.page';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public folder: string;
  public avatar: string;
  public infoDenuncia: any = {};
  public denunciaForm: any;
  
  public newsButton: boolean = false;
  public overlayHidden: boolean = false;
  public buttonHidden: boolean = true;
  public denunciaHidden: boolean = false;
  public mapHidden: boolean = false;
  public loading: boolean = false;

  map: GoogleMap;
  actualNumber: number;
  actualState: any;

  mudanca = 0;

  constructor(
    public global: GlobalService,
    public storage: Storage,
    public menuCtrl: MenuController,
    public modalController: ModalController,
    public loadingController: LoadingController,
    public formBuilder: FormBuilder,
    private admobFree: AdMobFree,
    private locationAccuracy: LocationAccuracy,
    private navCtrl: NavController,
    private platform: Platform,
    private http: HTTP,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private activatedRoute: ActivatedRoute) {
      this.denunciaForm = formBuilder.group({
        title: [''],
        description: [''],
      });
    }
  
  async ngOnInit() { 
    this.ativeMap();  

    const bannerConfig: AdMobFreeBannerConfig = {
      size: 'BANNER',
      autoShow: true
    };
    this.admobFree.banner.config(bannerConfig);
    this.admobFree.banner.prepare();
  }

  openAd() {
    this.admobFree.interstitial.prepare()
    this.admobFree.interstitial.show()
  }

  async ativeMap() {
    this.storage.get('firstTime').then(async (value) => {
      if(!value) {
        this.loadMap();
        this.ativeMap();
        this.storage.set('firstTime', true);
      } else {
        await this.locationAccuracy.canRequest().then((canRequest: boolean) => {
          if(canRequest) {
            this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
              () => {
                this.folder = this.activatedRoute.snapshot.paramMap.get('id');
                this.platform.ready().then(() => {
                  this.mapHidden = false; this.buttonHidden = true;
                  this.loadMap();
                });
              },
              error => { this.mapHidden = true; this.buttonHidden = false;}
            );
          } else {
            this.loadMap();
            this.ativeMap();
          } 
        });
      }
    });
  }

  async openModal() {
    this.newsButton = true;
    const modal = await this.modalController.create({
      component: ModalPage
    });    
    
    return await modal.present().finally(() => {
      this.newsButton = false;
    });
  }

  toggleOverlay(){
    if(this.overlayHidden == false) {
      this.overlayHidden = true;
      this.buttonHidden = false;
    }
    else {
      this.overlayHidden = false;
      this.buttonHidden = true;
    }
      
  }

  async loadMap() {
    /*
    const loading = await this.loadingController.create({
      message: 'Por favor, aguarde...',
    });
    await loading.present();*/

    Environment.setEnv({
      'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyB1ekhcMmOAkdwG77_lgpnwGpghFYcYqlc',
      'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyB1ekhcMmOAkdwG77_lgpnwGpghFYcYqlc'
    });

    this.geolocation.getCurrentPosition().then(async (resp) => {
      let mapOptions: GoogleMapOptions = {
        camera: {
           target: {
             lat: resp.coords.latitude,
             lng: resp.coords.longitude
           },
           zoom: 18,
           tilt: 0
         },
         controls: {
          'compass': false,
          'myLocationButton': false,
          'myLocation': true, 
          'indoorPicker': true,
          'zoom': false,       
          'mapToolbar': false  
        }
      };

      //loading.dismiss();
  
      this.map = GoogleMaps.create('map_canvas', mapOptions);
      this.map.on(GoogleMapsEvent.CAMERA_MOVE_END).subscribe(() => {
        const position = this.map.getCameraPosition().target;
        const zoom = this.map.getCameraZoom(); 

        if (zoom < 8 && zoom > 6)
          this.insertControll(1, position);
        else if (zoom < 13 && zoom > 8)
          this.insertControll(2, position);
        else if (zoom > 13)
          this.insertControll(3, position);
      });
     }).catch((error) => {
        console.log(error)
     });
    
    
  }

  goToMyLoc() {
    this.actualNumber = 0;
    this.actualState = '';
    this.map.clear();

    this.geolocation.getCurrentPosition().then((resp) => {
      this.map.animateCamera({
        target: {
          lat: resp.coords.latitude,
          lng: resp.coords.longitude
        },
        zoom: 18,
        duration: 2000
      });
    });
  }

  async insertControll(number, position) {
    const now = new Date();

    if (number == 1 && number != this.actualNumber) {
      this.map.clear();
      this.actualState = '';
      this.actualNumber = number;

      const data = await this.storage.get('allStates').then(val => val);
      if (data == null || now > data.date) {
          this.getAllStates();
      } else
        this.drawCircles(data.cleanData, 'allStates');
    }
    else if (number == 2) {
      this.actualNumber = number;

      let options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 2
      };

      this.nativeGeocoder.reverseGeocode(position.lat, position.lng, options)
        .then(async (result: NativeGeocoderResult[]) => {
          const { administrativeArea } = result[0];
          if (this.actualState != administrativeArea.replace('State of ', '')) {
            this.map.clear();
            this.actualState = administrativeArea.replace('State of ', '');
            const data = await this.storage.get(`${administrativeArea.replace('State of ', '')}`).then(val => val);

            if (!data || now > data.date){
              this.getPerState(administrativeArea);
            } else
              this.drawCircles(data.cleanData, 'perState');
          }
        })
        .catch((error: any) => console.log(error));
    }
    else if (number == 3 && number != this.actualNumber) {
      this.map.clear();
      this.actualNumber = number;
      this.actualState = '';
      this.getAllDenuncias();
    }
  
  }

  async getAllStates() {
    const loading = await this.loadingController.create({
      message: 'Carregando Pontos no mapa...',
    });
    await loading.present();
    this.storage.get('token').then(value => {
      this.http.get('https://coronago.herokuapp.com/coronaApi/getAllStates', {}, {
        'Authorization': `Bearrer ${value}`
      }).then(async data => {
          const now = new Date();
          const { cleanData } = JSON.parse(data.data);
          await this.storage.set('allStates', { 
            cleanData,
            date: now.setHours(now.getHours() + 2) });
          this.drawCircles(cleanData, 'allStates');
          loading.dismiss();
        }).catch((err) => {
          loading.dismiss();
          this.global.toast('Erro em encontrar os pontos, verifique a sua conexão')
        });
      });
  }

  async getPerState(state) {
    const loading = await this.loadingController.create({
      message: 'Carregando Pontos no mapa...',
    });
    await loading.present();
    this.storage.get('token').then(value => {
      this.http.get(`https://coronago.herokuapp.com/coronaApi/getPerState/${state}`, {}, {
        'Authorization': `Bearrer ${value}`
      }).then(async data => {
          const now = new Date();
          const { cleanData } = JSON.parse(data.data);
          now.setHours(now.getHours() + 2)
          await this.storage.set(`${state.replace('State of ', '')}`, { 
            cleanData,
            date: now });
          this.drawCircles(cleanData, 'perState');
          loading.dismiss();
        }).catch((err) => {
          this.global.toast('Estado não encontrado')
        });
      });
  }

  async getAllDenuncias() {
    const loading = await this.loadingController.create({
      message: 'Carregando Pontos no mapa...',
    });
    await loading.present();
    this.storage.get('token').then(value => {
      this.http.get('https://coronago.herokuapp.com/denuncias/getAllDenuncias', {}, {
        'Authorization': `Bearrer ${value}`
      }).then(data => {
        const { denuncias } = JSON.parse(data.data);
        this.drawMarker(denuncias);
        loading.dismiss();
      }).catch((err) => {
        loading.dismiss();
        this.global.toast('Erro em encontrar as denúncias, verifique a sua conexão')
      });
    });
  }

  drawCircles(array, type) {
    let radius;

    array.forEach(element => {
      if (element.position){
        const { latitude, longitude } = element.position;

        let marker: Marker = this.map.addMarkerSync({
          position: { lat: latitude, lng: longitude },
          icon: 'blue',
          animation: 'DROP',
        });

        let htmlInfoWindow = new HtmlInfoWindow();

        let frame: HTMLElement = document.createElement('div');
        frame.innerHTML = [
          `<h3 style="margin: 0;" >${element.state}</h3>`,
          `<h4 style="color: grey; margin: 0;">${element.city == undefined ? '': element.city}</h4>`,
          `<h5 style="margin: 0; margin-top: 10px;">Confirmados: ${element.confirmed}</h5>`,
          `<h5 style="margin: 0;">Mortes: ${element.deaths}</h5>`,
        ].join("");

        htmlInfoWindow.setContent(frame, {
          width: "200px",
          height: "150px"
        });

        marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
          marker.hideInfoWindow();
          htmlInfoWindow.open(marker);
        });
        switch (type) {
          case 'perState':
            radius = (element.confirmed * 5) > 10000 ? 10000 : (element.confirmed * 5);
            break;
          case 'allStates':
            radius = element.confirmed * 10;
            break;
          default:
            break;
        }
        let circle: Circle = this.map.addCircleSync({
          center: marker.getPosition(),
          radius,
          'strokeColor' : 'rgba(255, 0, 0, 0.3)',
          'strokeWidth': 2,
          fillColor: "rgba(255, 0, 0, 0.1)",
        });
        marker.bindTo("position", circle, "center");

      }
    });

  }

  drawMarker(array) {
    array.forEach(element => {
      let conf = { color: '', type: '', voted: false };
      switch (element.type) {
        case 'aglomeracoes':
          conf['color'] = '#2dd36f';
          conf['type'] = 'Aglomerações';
          break;
        case 'risco':
          conf['color'] = '#5260ff';
          conf['type'] = 'Situações de Risco';
          break;
        case 'incidenteRecente':
          conf['color'] = '#eb445a';
          conf['type'] = 'Areas com incidentes recentes';
        default:
          break;
      }
      let marker: Marker = this.map.addMarkerSync({
        position: { lat: element.lat, lng: element.lng },
        icon: conf.color,
        animation: 'DROP',
      });

      element.whoVote.forEach(item => {
        if (item._id == this.global.userGlobal._id)
          conf['voted'] = true;
      });

      let htmlInfoWindow = new HtmlInfoWindow();

      let frame: HTMLElement = document.createElement('div');
      frame.innerHTML = [
        '<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">',
        `<p style="margin: 0; margin-top: 5px; font-size: 20px;">${ conf.type }</p>`,
        `<p style="color: grey; margin: 0;">Por: ${ element.by.name == this.global.userGlobal.name ? 'Eu' : element.by.name } <span class="vote">Votos: ${ element.rank }</span></p>`,
        `<h3>${ element.title }</h3>`,
        `<p style="margin: 0;display: block;overflow: hidden;">${ element.description }</p>`,
        '<footer class="bottomButton">',
        '<button style="left: 1;" class="rank"><i class="material-icons">thumb_down</i></button>',
        '<button style="margin-left: 60%;" class="rank"><i class="material-icons">thumb_up</i></button>',
        '</footer>',
        `<style>
          button {
            background-color: white;
            color: #028090;
          }
          .bottomButton {
            margin-left: 10%;
            bottom: 0;
            display: ${ conf.voted ? 'none' : 'block' }
          }
          .vote {
            margin-left: 50%;
            color: ${ element.rank > 0 ? 'green' : 'red'};
          }
        </style>`
      ].join("");

      frame.getElementsByClassName('rank')[0].addEventListener('click', () => {
        this.storage.get('token').then(value => {
          this.http.put('https://coronago.herokuapp.com/denuncias/rankDenuncia', {
            id: element._id,
            rank: '-1',
          }, {
            'Authorization': `Bearrer ${value}`
          }).then(data => {
            this.global.toast(JSON.parse(data.data).success)
          }).catch(data => {
            this.global.toast(JSON.parse(data.data).error)
          });
        });
      });

      frame.getElementsByClassName('rank')[1].addEventListener('click', () => {
        this.storage.get('token').then(value => {
          this.http.put('https://coronago.herokuapp.com/denuncias/rankDenuncia', {
            id: element._id,
            rank: '1',
          }, {
            'Authorization': `Bearrer ${value}`
          }).then(data => {
            this.global.toast(JSON.parse(data.data).success)
          }).catch(data => {
            this.global.toast(JSON.parse(data.data).error)
          });
        });
      });

      htmlInfoWindow.setContent(frame, {
        width: '300px',
        height: '250px'
      });

      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        marker.hideInfoWindow();
        htmlInfoWindow.open(marker);
      });
    });
  }

  denunciaInsert(infos) {
    this.infoDenuncia = infos;
    this.map.setOptions({
      'gestures': {
        'zoom': false
      }
    });
    this.geolocation.getCurrentPosition().then((resp) => {
      const { latitude, longitude } = resp.coords;
      this.map.animateCamera({
        target: {
          lat: latitude,
          lng: longitude
        },
        zoom: 18,
        duration: 0
      });
    });
    this.overlayHidden = false;
    this.denunciaHidden = true;
  }

  cancelDenuncia(){
    this.denunciaHidden = false;
    this.buttonHidden = true;
    this.map.setOptions({
      'gestures': {
        'zoom': true
      }
    });
  }

  async confirmDenuncia() {
    this.loading = true;
    const { title, description } = this.denunciaForm.value;
    const { lat, lng } = await this.map.getCameraPosition().target;
    
    this.storage.get('token').then(value => {
      this.http.post('https://coronago.herokuapp.com/denuncias/register', {
        title,
        description,
        type: this.infoDenuncia.type,
        lat,
        lng,
      }, {
        'Authorization': `Bearrer ${value}`
      }).then(data => {
        this.denunciaForm.reset();
        const { denuncia } = JSON.parse(data.data);
        this.loading = false;

        let conf = { color: '', type: '' };
        switch (denuncia.type) {
          case 'aglomeracoes':
            conf['color'] = '#2dd36f';
            conf['type'] = 'Aglomerações';
            break;
          case 'risco':
            conf['color'] = '#5260ff';
            conf['type'] = 'Situações de Risco';
            break;
          case 'incidenteRecente':
            conf['color'] = '#eb445a';
            conf['type'] = 'Areas com incidentes recentes';
          default:
            break;
        }

        let marker: Marker = this.map.addMarkerSync({
          position: { lat: denuncia.lat, lng: denuncia.lng },
          icon: conf.color,
          animation: 'DROP',
        });

        let htmlInfoWindow = new HtmlInfoWindow();

        let frame: HTMLElement = document.createElement('div');
        frame.innerHTML = [
          '<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">',
        `<p style="margin: 0; margin-top: 5px; font-size: 20px;">${ conf.type }</p>`,
        `<p style="color: grey; margin: 0;">Por: Eu <span id="vote">Votos: ${ denuncia.rank }</span></p>`,
        `<h3>${ denuncia.title }</h3>`,
        `<p style="margin: 0;isplay: block;overflow: hidden;">${ denuncia.description }</p>`,
        `<style>
          button {
            background-color: white;
            color: #028090;
          }
          #vote {
            margin-left: 50%;
            color: ${ denuncia.rank > 0 ? 'green' : 'red'};
          }
        </style>`
        ].join("");

        htmlInfoWindow.setContent(frame, {
          width: "300px",
          height: "200px"
        });

        marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
          marker.hideInfoWindow();
          htmlInfoWindow.open(marker);
        });
        this.cancelDenuncia();
      }).catch(err => {
        const { error } = JSON.parse(err.error);
        this.global.toast(error);
      })
    });
  }

  logout() {
    this.storage.remove('user');
    this.storage.remove('token');
    this.global.toast('Sessão encerrada');
    this.navCtrl.navigateRoot('/login');
  }

}
