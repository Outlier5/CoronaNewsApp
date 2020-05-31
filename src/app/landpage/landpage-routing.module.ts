import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandpagePage } from './landpage.page';

const routes: Routes = [
  {
    path: '',
    component: LandpagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandpagePageRoutingModule {}
