import { MaterialModule } from './../material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForgotPageRoutingModule } from './forgotpass-routing.module';

import { ForgotPage } from './forgotpass.page';



@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    ForgotPageRoutingModule,
    MaterialModule
  ],
  declarations: [ForgotPage]
})
export class ForgotPageModule {}
