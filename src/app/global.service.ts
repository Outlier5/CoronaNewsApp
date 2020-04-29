import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  public userGlobal: any; 
  public avatar: any;

  constructor(public toastController: ToastController) { }

  async toast(mss) {
    const toast = await this.toastController.create({
      message: mss,
      duration: 2000
    });
    toast.present();
  }
}
