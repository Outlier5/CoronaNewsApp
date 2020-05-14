import { Component, OnInit } from '@angular/core';
import { AdMobFree } from '@ionic-native/admob-free/ngx';

@Component({
  selector: 'app-sobre',
  templateUrl: './sobre.page.html',
  styleUrls: ['./sobre.page.scss'],
})
export class SobrePage implements OnInit {
  adMobFree: any;

  constructor(private admobFree: AdMobFree) { }

  ngOnInit() {
  }
  openAd() {
    this.admobFree.interstitial.config({
      id: 'ca-app-pub-7992243410212657/5917033016',
     });
    this.admobFree.interstitial.prepare().then((data: any) => {
      this.admobFree.interstitial.show()
    }).catch((e:Error)=>{
      console.log("Error ",e);
    });
  }
}
