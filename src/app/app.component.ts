import { Component, OnInit } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';

import { HomePage } from './home/home.page';





declare var window: any;

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
    private navCtrl: NavController,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.rootPage = HomePage;
      const style = document.documentElement.style;
      if (window.AndroidNotch) {
        this.statusBar.styleDefault();
        this.statusBar.backgroundColorByHexString("#00000000");
        window.AndroidNotch.getInsetTop(px => {
          style.setProperty("--notch-inset-top", px + "px");
        }, (err) => {
          this.statusBar.styleDefault();
          this.statusBar.backgroundColorByHexString("#02c39a");
        });
      } else {
        this.statusBar.styleDefault();
        this.statusBar.backgroundColorByHexString("#02c39a");
      }
      this.storage.get('firstTime').then(async (value) => {
        if (!value) {
          this.navCtrl.navigateRoot('/welcome');
        }
      });
      this.splashScreen.hide();
    });
  }
  ngOnInit() {
  }
}
