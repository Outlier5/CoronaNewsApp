import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LandpagePageRoutingModule } from './landpage-routing.module';

import { LandpagePage } from './landpage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LandpagePageRoutingModule
  ],
  declarations: [LandpagePage]
})
export class LandpagePageModule {}
