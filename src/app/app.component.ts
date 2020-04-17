import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';

import { HomePage } from './home/home.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit{
  public selectedIndex = 0;
  public user: any;
  public appPages = [
    {
      title: 'Mapa',
      url: '/home',
      icon: 'mail'
    },
    {
      title: 'Noticias',
      url: '/news',
      icon: 'paper-plane'
    },
    {
      title: 'Opções',
      url: '/options',
      icon: 'heart'
    },
  ];

  rootPage: any;

  constructor(
    public storage: Storage,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
    this.user = { 
      name: "Nome Teste"
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.rootPage = HomePage;
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  logout() {
    alert('logout');
  }
  
  ngOnInit() {
    const path = window.location.pathname.split('home/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }
}
