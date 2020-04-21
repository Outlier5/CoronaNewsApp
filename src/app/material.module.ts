import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatFormFieldModule,
  MatSelectModule,
  MatTabsModule,
  MatButtonModule,
  MatCardModule,
  MatDividerModule,
  MatSidenavModule,
  MatListModule,
  MatInputModule
} from '@angular/material';

@NgModule({
  exports: [
    MatFormFieldModule,
    MatSelectModule,
    MatTabsModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatSidenavModule,
    MatListModule,
    MatInputModule
  ],
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class MaterialModule { }
