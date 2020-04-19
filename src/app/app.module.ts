import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { GoogleMaps } from '@ionic-native/google-maps/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { ModalPageModule } from './modal/modal.module';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { NgxTwitterTimelineModule } from 'ngx-twitter-timeline';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    ModalPageModule,
    NgxTwitterTimelineModule,
    BrowserAnimationsModule
    ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    GoogleMaps,
    HTTP,
    Geolocation,
    NativeGeocoder,
    InAppBrowser
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
