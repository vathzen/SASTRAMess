import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
      path: 'main',
      loadChildren: './main/main.module#MainPageModule'
  },
  {
      path: 'menu',
      loadChildren: './menu/menu.module#MenuPageModule'
  },
  { path: 'history', loadChildren: './history/history.module#HistoryPageModule' },
  { path: 'settings', loadChildren: './settings/settings.module#SettingsPageModule' }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
