import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController, NavController, LoadingController, ModalController } from '@ionic/angular';
import { RestService } from '../services/rest.service';
import { Response } from '../services/classes';
import { ChangePasswordPage } from '../change-password/change-password.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {

  regnum:string=null;
  pswrd:string=null;
  hasChangedPassword:boolean=null;
  authStatus = new Response();
  constructor(
    public alertController: AlertController,
    private storage: Storage,
    private restService: RestService,
    private navCtrl: NavController,
    private loadCtrl: LoadingController,
    private modalController: ModalController){}

  ngOnInit(){
    this.checkFirstTime();
  }

  async popAlert(_header,_subHeader,_message,_buttons){
    const alert = await this.alertController.create({
      header: _header,
      subHeader: _subHeader,
      message: _message,
      buttons: _buttons
    });

    await alert.present();
  }

  checkFirstTime(){
    this.storage.get('first_time').then((val) => {
      if (val == null) {
         this.popAlert('Hey!','Looks like its your first time here','Login with you PWI credentials',['OK']);
      }
   });
  }

  async onClickLogin(){
    if(this.regnum==null||this.pswrd==null){
      this.popAlert('Missed Something?','','Fill all fields to continue',['OK']);
    }
    else{
      /*const loading = await this.loadCtrl.create({
          message: 'Logging In'
      });
      await loading.present();*/
      this.restService.userAuth(this.regnum,this.pswrd).subscribe(
          (response) => {
              this.authStatus = response;
              if(this.authStatus.Status=="false"){
                //loading.dismiss();
                this.popAlert('Typo?','Incorrect register number or password','Please try again',['OK']);
              }
              else{
                //loading.dismiss();
                this.storage.get('first_time').then((val) => {
                  if (val == null ) {
                     this.presentAlertPrompt();
                  }
                  else{
                    this.hasChangedPassword=false;//get hasChanged along with hostel,contractor
                    if(this.hasChangedPassword){
                      this.storage.set('reg_num', this.regnum);
                      this.storage.set('pswrd', this.pswrd);
                      this.storage.set('name',this.authStatus.Text.split(",")[0]);
                      this.storage.set('hostel',this.authStatus.Text.split(",")[1]);
                      this.storage.set('contractor','Just get from db pls');
                      this.navCtrl.navigateRoot(['main']);
                    }
                    else{
                      this.changePassword();
                    }
                  }
               });
              }
          },err => {
              console.log(err);
          }
      );
    }
  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      header: 'Enter 4-digit code',
      subHeader: 'To verify it is you, show your ID card to your mess authorities and enter the code they give you',
      message: 'Don\'t worry, it\'s just a one-time process!',
      inputs: [
        {
          name: 'code',
          type: 'number',
          placeholder: 'Enter code'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        }, {
          text: 'Verify',
          handler: (data) => {
            if(data.code){
              this.verifyCode(Number(data.code));
            }
            else{
              this.presentAlertPrompt();
            }
          }
        }
      ]
    });

    await alert.present();
  }
  
  async verifyCode(code:number){
    const loading = await this.loadCtrl.create({
      message: 'Verifying'
    });
    await loading.present();

    //verify code

    if(true){
      this.storage.set('first_time', 'false');
      loading.dismiss();
      this.changePassword();
    }
    else{
      loading.dismiss();
      this.presentAlertPrompt();
      this.codeErrorAlert();
    }
  }

  async changePassword(){
      const modal = await this.modalController.create({
      component: ChangePasswordPage,
      backdropDismiss: false,
      cssClass: 'custom-modal-css'
    });
    modal.present();
    await modal.onDidDismiss();
    this.hasChangedPassword=true; //Write this to server on dismiss
    this.showChangedSuccess();
  }

  async showChangedSuccess(){
    const alert = await this.alertController.create({
      header: 'Password changed successfully!',
      subHeader: 'You\'re all set! Log in to continue.',
      buttons: [
        {
          text: 'Ok'
        },
      ]
    });

    await alert.present();
  }

  async codeErrorAlert(){
    const alert = await this.alertController.create({
      header: 'Wrong code',
      subHeader: 'Check your code and try again',
      buttons: [
        {
          text: 'Ok'
        },
      ]
    });

    await alert.present();
  }
}
