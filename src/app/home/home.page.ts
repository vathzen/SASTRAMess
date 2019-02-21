import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(public alertController: AlertController, private storage: Storage){
    this.checkFirstTime();
  }

  async popAlert()
  {
    const alert = await this.alertController.create({
      header:'Hey!',
      subHeader:'Looks like its your first time here',
      message:'Login with you PWI credentials',
      buttons: ['OK']
    });

    await alert.present();
  }

  checkFirstTime()
  {
    this.storage.get('first_time').then((val) => {
      if (val == null) {
         this.storage.set('first_time', 'false');
         this.popAlert();
      }
   });
  }

  login()
  {
    //call auth service
  }

}
