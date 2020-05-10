import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AndroidFullScreen } from '@ionic-native/android-full-screen/ngx';
import { Storage } from '@ionic/storage';

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
    private androidFullScreen: AndroidFullScreen, 
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.rootPage = HomePage;

      this.androidFullScreen.isImmersiveModeSupported()
        .then(() => console.log('feijoada'))
        .catch(err => this.androidFullScreen.leanMode());

      this.storage.get('firstTime').then(async (value) => {
        if(!value) {
          // AQUI COLOQUE O CODIGO PARA ABRI O SLIDE
        }
      });
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString("#00000000");
      this.splashScreen.hide();
    });
  }
  ngOnInit() {
  }
}
