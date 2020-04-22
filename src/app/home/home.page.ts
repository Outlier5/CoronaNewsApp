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
import { Component } from "@angular/core";
import { Platform, MenuController, ModalController } from '@ionic/angular';

import { ActivatedRoute } from '@angular/router';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { Storage } from '@ionic/storage';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public folder: string;
  public user = { name: 'aa', email:'bb@bb.com' };
  map: GoogleMap;
  actualNumber: 0;

  constructor(
    public storage: Storage,
    public menuCtrl: MenuController,
    public modalController: ModalController,
    private platform: Platform,
    private http: HTTP,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    this.platform.ready().then(() => {
      this.loadMap();
    });
    this.storage.get('user').then(value => {
      this.user = value;
      console.log(this.user)
    });
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: ModalPage
    });
    return await modal.present();
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
        duration: 2000
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

  logout() {
    alert('logout');
  }

}
