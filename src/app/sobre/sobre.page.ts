import { Component, OnInit } from '@angular/core';
import { AdMobFree, AdMobFreeRewardVideoConfig } from '@ionic-native/admob-free/ngx';

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
    const rewardedConfig: AdMobFreeRewardVideoConfig = {
      id: 'ca-app-pub-7992243410212657/9848399548',
      isTesting: false
    }
    this.adMobFree.rewardVideo.config(rewardedConfig);
    this.admobFree.rewardVideo.prepare().then((data:any)=>{
      this.adMobFree.rewardVideo.show()
    })
    .catch((e:Error)=>{
       console.log("Error ",e);
    });

  }

}
