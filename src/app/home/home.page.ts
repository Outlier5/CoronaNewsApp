import {
  GoogleMaps,
  GoogleMap,
  GoogleMapOptions,
  Circle,
  Marker,
  Environment,
  LatLng,
  GoogleMapsEvent
} from '@ionic-native/google-maps/ngx';
import { Component } from "@angular/core";
import { Platform } from '@ionic/angular';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { Storage } from '@ionic/storage';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  map: GoogleMap;
  actualNumber: 0;

  constructor(
    public storage: Storage,
    private platform: Platform,
    private http: HTTP,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder) { }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.loadMap();
    });
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
          'compass': true,
          'myLocationButton': false,
          'myLocation': true, 
          'indoorPicker': true,
          'zoom': false,       
          'mapToolbar': true  
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

      this.drawCircles(data.cleanData);
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

          this.drawCircles(data.cleanData);
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
          this.drawCircles(cleanData);
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
          this.drawCircles(cleanData);
        });
      });
  }

  drawCircles(array) {
    this.map.clear();
    array.forEach(element => {
      if (element.position){
        const { latitude, longitude } = element.position;

        let marker: Marker = this.map.addMarkerSync({
          position: { lat: latitude, lng: longitude },
          title: element.state,
          icon: 'blue',
          animation: 'DROP',
        });
        
        //console.log(element.confirmed * (this.map.getCameraZoom() / 0.1))
        let circle: Circle = this.map.addCircleSync({
          center: marker.getPosition(),
          radius: element.confirmed * 30,
          fillColor: "rgba(255, 0, 0, 0.5)",
        });
        marker.bindTo("position", circle, "center");
      }
    });
  }
}
