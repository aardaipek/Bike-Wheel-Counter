import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './pages/sports/sports.module#SportsPageModule' },
  { path: 'sports', loadChildren: './pages/sports/sports.module#SportsPageModule' },
  { path: 'goals', loadChildren: './pages/goals/goals.module#GoalsPageModule' },
  { path: 'ride', loadChildren: './pages/ride/ride.module#RidePageModule' },
  { path: 'tab1', loadChildren: './tab1/tab1.module#Tab1PageModule' }
  
  ];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
