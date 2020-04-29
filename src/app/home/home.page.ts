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
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Platform, MenuController, ModalController, NavController, NavParams } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { Storage } from '@ionic/storage';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

import { ModalPage } from '../modal/modal.page';
import { GlobalService } from '../global.service';

import { MatDrawer} from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('drawer', { static: true }) drawer: MatDrawer;
  
  handleSwipeRight(drawer){
    if (this.sideMenu == false){
      this.sideMenu = true;
      this.drawer.toggle();
    }
  }
  handleSwipeLeft(drawer){
    if (this.sideMenu == true){
      this.sideMenu = false;
      this.drawer.toggle();
    }
  }
  public folder: string;
  public avatar: string;
  public infoDenuncia: any = {};
  public denunciaForm: any;
  public sideMenu: boolean = false;
  public overlayHidden: boolean = false;
  public buttonHidden: boolean = true;
  public denunciaHidden: boolean = false;

  map: GoogleMap;
  actualNumber: 0;

  constructor(
    public global: GlobalService,
    public storage: Storage,
    public menuCtrl: MenuController,
    public modalController: ModalController,
    public  formBuilder: FormBuilder,
    private router: Router,
    public navCtrl: NavController, 
    public navParams: NavParams,
    private platform: Platform,
    private http: HTTP,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private activatedRoute: ActivatedRoute) {
      this.denunciaForm = formBuilder.group({
        title: [''],
        description: [''],
      });
      /*this.platform.ready().then(() => {
        document.addEventListener('backbutton', () => {
          if (this.navCtrl.canGoBack()) {
            this.platform.exitApp()
            return;
          }
          this.navCtrl.pop()
          }, false);
      });*/
    }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    this.platform.ready().then(() => {
      this.loadMap();
    });
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: ModalPage
    });
    return await modal.present();
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

  loadMap() {
    Environment.setEnv({
      'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyCOwpKWB6VSvclPt6yoUJIP_jk9LVvzOsM',
      'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyCOwpKWB6VSvclPt6yoUJIP_jk9LVvzOsM'
    });


    this.geolocation.getCurrentPosition().then((resp) => {
      let mapOptions: GoogleMapOptions = {
        camera: {
           target: {
             lat: resp.coords.latitude,
             lng: resp.coords.longitude
           },
           zoom: 18,
           tilt: 30
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
  
      this.map = GoogleMaps.create('map_canvas', mapOptions);
      this.map.on(GoogleMapsEvent.CAMERA_MOVE_END).subscribe(() => {
        const position = this.map.getCameraPosition().target;
        
        const zoom = this.map.getCameraZoom(); 
        if (zoom < 8 && zoom > 6)
          this.insertControll(1, position);
        else if (zoom < 15 && zoom > 8)
          this.insertControll(2, position);
        else if (zoom > 15)
          this.insertControll(3, position);
      });
     }).catch((error) => {
       console.log('Error getting location', error);
     });
    
    
  }

  goToMyLoc() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.map.animateCamera({
        target: {
          lat: resp.coords.latitude,
          lng: resp.coords.longitude
        },
        zoom: 18,
        duration: 0
      });
    });
  }

  async insertControll(number, position) {
    const date = new Date();

    if (number == 1 && number != this.actualNumber) {
      this.actualNumber = number;
      const data = await this.storage.get('allStates').then(val => val);
      if (data == null || 
        (date.getDate() > data.date.day ||
        date.getMonth() > data.date.month ||
        date.getFullYear() > data.date.year))
          this.getAllStates();

      this.drawCircles(data.cleanData, 'allStates');
    }
    else if (number == 2 && number != this.actualNumber) {
      this.actualNumber = number;

      let options: NativeGeocoderOptions = {
        useLocale: true,
          maxResults: 5
      };

      this.nativeGeocoder.reverseGeocode(position.lat, position.lng, options)
        .then(async (result: NativeGeocoderResult[]) => {
          const { administrativeArea } = result[0];
          const data = await this.storage.get(`${administrativeArea.replace('State of ', '')}`).then(val => val);

          if (data == null || 
            (date.getDate() > data.date.day ||
            date.getMonth() > data.date.month ||
            date.getFullYear() > data.date.year))
              this.getPerState(administrativeArea);

          this.drawCircles(data.cleanData, 'perState');
        })
        .catch((error: any) => console.log(error));
    }
    else if (number == 3 && number != this.actualNumber) { 
      this.actualNumber = number;
      this.getAllDenuncias();
    }
  
  }

  getAllStates() {
    const d = new Date()
    console.log(d.getDate());
    this.storage.get('token').then(value => {
      this.http.get('https://coronago.herokuapp.com/coronaApi/getAllStates', {}, {
        'Authorization': `Bearrer ${value}`
      }).then(data => {
        const date = new Date();
        const { cleanData } = JSON.parse(data.data);
          this.storage.set('allStates', { 
            cleanData,
            date: { year: date.getFullYear(), month: date.getMonth(), day: date.getDate() } });
          this.drawCircles(cleanData, 'allStates');
        });
      });
  }

  getPerState(state) {
    const d = new Date()
    console.log(d.getDate());
    this.storage.get('token').then(value => {
      this.http.get(`https://coronago.herokuapp.com/coronaApi/getPerState/${state}`, {}, {
        'Authorization': `Bearrer ${value}`
      }).then(data => {
        const date = new Date();
        const { cleanData } = JSON.parse(data.data);
          this.storage.set(`${state.replace('State of ', '')}`, { 
            cleanData,
            date: { year: date.getFullYear(), month: date.getMonth(), day: date.getDate() } });
          this.drawCircles(cleanData, 'perState');
        });
      });
  }

  getAllDenuncias() {
    this.storage.get('token').then(value => {
      this.http.get('https://coronago.herokuapp.com/denuncias/getAllDenuncias', {}, {
        'Authorization': `Bearrer ${value}`
      }).then(data => {
        const { denuncias } = JSON.parse(data.data);
        console.log(denuncias)
        this.drawMarker(denuncias);
      });
    });
  }

  drawCircles(array, type) {
    this.map.clear();
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
          `<h3>${element.state}</h3>`,
          `<h4>${element.city == undefined ? '': element.city}</h4>`,
          `<h5>Confirmados: ${element.confirmed}</h5>`,
          `<h5>Mortes: ${element.deaths}</h5>`,
        ].join("");

        htmlInfoWindow.setContent(frame, {
          width: "200px",
          height: "200px"
        });

        marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
          marker.hideInfoWindow();
          htmlInfoWindow.open(marker);
        });
        switch (type) {
          case 'perState':
            radius = (element.confirmed * 10) > 10000 ? 10000 : (element.confirmed * 10);
            break;
          case 'allStates':
            radius = element.confirmed * 20;
            break;
          default:
            break;
        }
        let circle: Circle = this.map.addCircleSync({
          center: marker.getPosition(),
          radius,
          fillColor: "rgba(255, 0, 0, 0.5)",
        });
        marker.bindTo("position", circle, "center");
      }
    });
  }

  drawMarker(array) {
    this.map.clear();

    array.forEach(element => {
      let conf = { color: '', type: '' };
      switch (element.type) {
        case 'aglomeracoes':
          conf['color'] = 'red';
          conf['type'] = 'Aglomerações';
          break;
        case 'risco':
          conf['color'] = 'yellow';
          conf['type'] = 'Situações de Risco';

          break;
        case 'incidenteRecente':
          conf['color'] = 'green';
          conf['type'] = 'Areas com incidentes recentes';
        default:
          break;
      }
      let marker: Marker = this.map.addMarkerSync({
        position: { lat: element.lat, lng: element.lng },
        icon: conf.color,
        animation: 'DROP',
      });

      let htmlInfoWindow = new HtmlInfoWindow();

      let frame: HTMLElement = document.createElement('div');
      frame.innerHTML = [
        `<h3>${ conf.type }</h3>`,
        '<hr style="background: grey; margin-right: 10px;">',
        `<h3>${ element.title }</h3>`,
        `<p style="
          margin: 0;
          display: block;
          overflow: hidden;
        ">${ element.description }</p>`,
      ].join("");

      htmlInfoWindow.setContent(frame, {
        width: '300px',
        height: '200px'
      });

      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        marker.hideInfoWindow();
        htmlInfoWindow.open(marker);
      });
    });
  }

  denunciaInsert(infos) {
    this.infoDenuncia = infos;
    this.geolocation.getCurrentPosition().then((resp) => {
      const { latitude, longitude } =resp.coords;
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
  }

  async confirmDenuncia() {

    const { title, description } = this.denunciaForm.value;
    const { lat, lng } = await this.map.getCameraPosition().target;

    console.log(this.map.getCameraPosition().target)
    console.log(lat)
    console.log(lng)

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
        const { denuncia } = JSON.parse(data.data);

        let conf = { color: '', type: '' };
        switch (denuncia.type) {
          case 'aglomeracoes':
            conf['color'] = 'red';
            conf['type'] = 'Aglomerações';
            break;
          case 'risco':
            conf['color'] = 'yellow';
            conf['type'] = 'Situações de Risco';
  
            break;
          case 'incidenteRecente':
            conf['color'] = 'green';
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
          `<h3>${ conf.type }</h3>`,
          '<hr style="background: grey; margin-right: 10px;">',
          `<h3>${ denuncia.title }</h3>`,
          `<p style="
            margin: 0;
            display: block;
            overflow: hidden;
          ">${ denuncia.description }</p>`,
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
        console.log(err);
      })
    });
  }

  logout() {
    this.storage.clear();
    alert('logout');
    this.router.navigate(['/login']);
  }

}
