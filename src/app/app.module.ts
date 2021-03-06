import { PopoverComponent } from './popover/popover.component';
import { ModalDenunciasComponent } from './modal-denuncias/modal-denuncias.component';
import { ModalComponent } from './modal/modal.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router'
import { FormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { GoogleMaps } from '@ionic-native/google-maps/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidFullScreen } from '@ionic-native/android-full-screen/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { BrowserTab } from '@ionic-native/browser-tab/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { AdMobFree } from '@ionic-native/admob-free/ngx';
import { NavigationBar } from '@ionic-native/navigation-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { GlobalService } from './global.service';
import { IonicGestureConfig } from './ionicGestureConfig.module';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [AppComponent, ModalDenunciasComponent, PopoverComponent, ModalComponent],
  entryComponents: [ModalDenunciasComponent, PopoverComponent, ModalComponent],
  imports: [
    FormsModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
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
    SocialSharing,
    NavigationBar,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: IonicGestureConfig
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
