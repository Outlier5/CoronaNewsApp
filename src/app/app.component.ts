import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device/ngx';

import { HomePage } from './home/home.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit{
  rootPage: any;

  constructor(
    public storage: Storage,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private device: Device,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.rootPage = HomePage;

      if (parseInt(this.device.version) <= 5){
        this.statusBar.styleDefault();
        this.statusBar.backgroundColorByHexString("#02c39a");
      } else {
        this.statusBar.styleDefault();
        this.statusBar.backgroundColorByHexString("#00000000");
      }

      this.storage.get('firstTime').then(async (value) => {
        if(!value) {
          // AQUI COLOQUE O CODIGO PARA ABRI O SLIDE
        }
      });
      this.splashScreen.hide();
    });
  }
  ngOnInit() {
  }
}
