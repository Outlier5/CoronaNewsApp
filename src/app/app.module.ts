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
import { AndroidFullScreen } from '@ionic-native/android-full-screen/ngx';

import { BrowserTab } from '@ionic-native/browser-tab/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { AdMobFree } from '@ionic-native/admob-free/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { ModalPageModule } from './modal/modal.module';
import { GlobalService } from './global.service';

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
    BrowserAnimationsModule,
    ],
  providers: [
    StatusBar,
    SplashScreen,
    GoogleMaps,
    HTTP,
    Geolocation,
    NativeGeocoder,
    InAppBrowser,
    BrowserTab,
    ImagePicker,
    WebView,
    FileTransfer,
    FileTransferObject,
    LocationAccuracy,
    GlobalService,
    AndroidFullScreen,
    AdMobFree,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
