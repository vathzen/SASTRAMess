import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController} from '@ionic/angular';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  constructor( public alertController: AlertController, private loadCtrl: LoadingController, private modalController: ModalController ) { }

  pswrd:string=null;
  sufficientLength:boolean=null;

  ngOnInit() {
  }

  inputChanged(){
    if(this.pswrd&&this.pswrd.length>=8){
      this.sufficientLength=true;
    }
    else{
      this.sufficientLength=false;
    }
  }

 async changePassword(){
    const loading = await this.loadCtrl.create({
      message: 'Verifying'
    });
    await loading.present();

    //change password

    if(true){
      loading.dismiss();
      this.modalController.dismiss();
    }
    else{
      loading.dismiss();
      this.pswrd=null;
      this.showErrorAlert();
    }
  }

  async showErrorAlert(){
    const alert = await this.alertController.create({
      header: 'Something went wrong',
      subHeader: 'Please try again',
      buttons: [
        {
          text: 'Ok'
        },
      ]
    });

    await alert.present();
  }
}
