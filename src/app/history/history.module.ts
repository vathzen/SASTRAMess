import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HistoryPage } from './history.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'month-wise',
    pathMatch: 'full'
  },
  {
    path: '',
    component: HistoryPage,
    children : [
      { path: 'month-wise', loadChildren: '../month-wise/month-wise.module#MonthWisePageModule' },
      { path: 'item-wise', loadChildren: '../item-wise/item-wise.module#ItemWisePageModule' }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HistoryPage]
})
export class HistoryPageModule {}
