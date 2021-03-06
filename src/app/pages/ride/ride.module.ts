import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { IonicModule } from '@ionic/angular';

import { RidePage } from './ride.page';

const routes: Routes = [
  {
    path: '',
    component: RidePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgCircleProgressModule.forRoot({}),
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RidePage]
})
export class RidePageModule {}
