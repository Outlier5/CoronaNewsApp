import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatFormFieldModule,
  MatSelectModule,
  MatTabsModule,
  MatButtonModule,
  MatListModule
} from '@angular/material';

@NgModule({
  exports: [
    MatFormFieldModule,
    MatSelectModule,
    MatTabsModule,
    MatButtonModule,
    MatListModule
  ],
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class MaterialModule { }
