import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-denuncias',
  templateUrl: './modal-denuncias.component.html',
  styleUrls: ['./modal-denuncias.component.scss'],
})
export class ModalDenunciasComponent implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {}
  async closeModal() { 
    this.modalController.dismiss();
  }
}
