import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AuthService } from'../auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  regnum:"";
  pswrd:"";

  constructor(public alertController: AlertController, private storage: Storage, private authService: AuthService){
    this.checkFirstTime();
  }

  async popFirstAlert()
  {
    const alert = await this.alertController.create({
      header:'Hey!',
      subHeader:'Looks like its your first time here',
      message:'Login with you PWI credentials',
      buttons: ['OK']
    });

    await alert.present();
  }

  async popAuthAlert()
  {
    const alert = await this.alertController.create({
      header:'Typo?',
      subHeader:'Incorrect register number or password',
      message:'Please try again',
      buttons: ['OK']
    });

    await alert.present();
  }

  async popFillAllAlert()
  {
    const alert = await this.alertController.create({
      header:'Missed Something?',
      subHeader:'',
      message:'Fill all fields to continue',
      buttons: ['OK']
    });

    await alert.present();
  }

  checkFirstTime()
  {
    this.storage.get('first_time').then((val) => {
      if (val == null) {
         this.storage.set('first_time', 'false');
         this.popFirstAlert();
      }
   });
  }

  login()
  { if(this.regnum=="")
    {
      this.regnum=null;
    }
    if(this.pswrd=="")
    {
      this.pswrd=null;
    }
    if((this.regnum==null)||(this.pswrd==null)){
      this.popFillAllAlert();
    }
    else{
      const authStatus= this.authService.dummyAuth(this.regnum,this.pswrd);
      if(authStatus==false){
        this.popAuthAlert();
      }
      else{
        //launch next page
        console.log('Launched!');
      }
    }
  }

}
