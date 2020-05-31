import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController } from '@ionic/angular';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})

export class WelcomePage implements OnInit {
  finished = false;
  slideOpts = {
    initialSlide: 0,
  };
  @ViewChild('mySlider', { static: true }) slides: IonSlides;  
  constructor(
    private navCtrl: NavController,
    ) { }
  ngOnInit() {
  }
  swipeNext(){
    this.slides.slideNext();
  }
  swipeEnd(){
    this.slides.slideTo(3);
  }
  finish(){
    this.finished = true;
  }
  goToLog(){
    this.navCtrl.navigateRoot('/home');
  }
}
