import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalPageRoutingModule } from './modal-routing.module';

import { ModalPage } from './modal.page';

import { NgxTwitterTimelineModule } from 'ngx-twitter-timeline';
import { MaterialModule } from '../material.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalPageRoutingModule,
    NgxTwitterTimelineModule,
    MaterialModule
  ],
  declarations: [ModalPage]
})
export class ModalPageModule {}
