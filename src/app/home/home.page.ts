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

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  map: GoogleMap;

  constructor(private platform: Platform) { }

  ngOnInit() {
    this.platform.ready();
    this.loadMap();
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
    
    let GOOGLE: ILatLng = {"lat" : 43.0741904, "lng" : -89.3809802};

    this.map = GoogleMaps.create('map_canvas', mapOptions);

    let circle: Circle = this.map.addCircleSync({
      'center': GOOGLE,
      'radius': 300,
      'strokeWidth': 5,
      'fillColor' : '#880000'
    })
  }
}
