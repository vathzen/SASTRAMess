import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AuthService } from'../services/auth.service';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  regnum:"";
  pswrd:"";

  constructor(
    public alertController: AlertController,
    private storage: Storage,
    private authService: AuthService,
    private navCtrl: NavController) {}

  ngOnInit(){
    this.checkFirstTime();
  }

  async popAlert(_header,_subHeader,_message,_buttons)
  {
    const alert = await this.alertController.create({
      header: _header,
      subHeader: _subHeader,
      message: _message,
      buttons: _buttons
    });

    await alert.present();
  }

  checkFirstTime()
  {
    this.storage.get('first_time').then((val) => {
      if (val == null) {
         this.storage.set('first_time', 'false');
         this.popAlert('Hey!','Looks like its your first time here','Login with you PWI credentials',['OK']);
      }
   });
  }

  login()
  {
    if((this.regnum==null)||(this.pswrd==null)||(this.regnum=="")||(this.pswrd=="")){
      this.popAlert('Missed Something?','','Fill all fields to continue',['OK']);
    }
    else{
      const authStatus = this.authService.sendForAuth(this.regnum,this.pswrd);
      //if(authStatus == false){
    //    this.popAlert('Typo?','Incorrect register number or password','Please try again',['OK']);
      //}
      //else{
        //launch next page
        //this.storage.set('reg_num', this.regnum);
        //this.storage.set('pswrd', this.pswrd);
        //this.navCtrl.navigateRoot(['main']);
      //}
    }
  }

}
