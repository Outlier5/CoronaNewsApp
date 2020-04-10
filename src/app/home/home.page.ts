import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  Circle,
  Environment,
  ILatLng
} from '@ionic-native/google-maps/ngx';
import { Component } from "@angular/core";
import { Platform } from '@ionic/angular';

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

  constructor(
    public storage: Storage,
    private platform: Platform,
    private http: HTTP,
    private nativeGeocoder: NativeGeocoder) { }

  ngOnInit() {
    this.platform.ready();
    this.loadMap();
    this.getCircles();
  }

  loadMap() {
    Environment.setEnv({
      'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyCOwpKWB6VSvclPt6yoUJIP_jk9LVvzOsM',
      'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyCOwpKWB6VSvclPt6yoUJIP_jk9LVvzOsM'
    });

    let mapOptions: GoogleMapOptions = {
      camera: {
         target: {
           lat: 43.0741904,
           lng: -89.3809802
         },
         zoom: 18,
         tilt: 30
       },
       controls: {
        'compass': true,
        'myLocationButton': true,
        'myLocation': true, 
        'indoorPicker': true,
        'zoom': false,       
        'mapToolbar': true  
      }
    };

    this.map = GoogleMaps.create('map_canvas', mapOptions);
    
  }

  getCircles() {
    this.storage.get('token').then(value => {
      this.http.get('https://coronago.herokuapp.com/coronaApi/getAllStates', {}, {
        'Authorization': `Bearrer ${value}`
      }).then(data => {
        const { cleanData } = JSON.parse(data.data);

        let options: NativeGeocoderOptions = {
          useLocale: true,
          maxResults: 5
        };
        
        this.nativeGeocoder.forwardGeocode('Alagoas', options)
          .then((result: NativeGeocoderResult[]) => {
            console.log('The coordinates are latitude=' + result[0].latitude + ' and longitude=' + result[0].longitude)
          })
          .catch((error: any) => console.log(error));
      });
    });

  
  }
}
