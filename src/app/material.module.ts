import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatFormFieldModule,
  MatSelectModule,
  MatTabsModule,
  MatButtonModule,
  MatCardModule,
  MatDividerModule
} from '@angular/material';

@NgModule({
  exports: [
    MatFormFieldModule,
    MatSelectModule,
    MatTabsModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule
  ],
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class MaterialModule { }
