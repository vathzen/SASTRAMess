import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController} from '@ionic/angular';
import { of } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  constructor( public alertController: AlertController, private loadCtrl: LoadingController, private modalController: ModalController, public toastController: ToastController ) { }

  regnum:string=null;
  pswrd:string=null;
  regnumValid:number=null;
  timeVar:any=null;
  inputType:string='password';
  eyeIcon:string='eye';
  sufficientLength:boolean=null;

  ngOnInit() {
  }

  regnumInputChanged(){
    clearTimeout(this.timeVar);
    if(this.regnum.length==9){
      //check if regnum exists in pwi
      if(true){
        this.regnumValid=1;
      }
      else{
        this.regnumValid=-1;
      }
    }
    else{
      this.regnumValid=0;
      this.timeVar = setTimeout(() => {
        this.regnumValid=-1;
      }, 1500);
    }
  }

  pswrdInputChanged(){
    if(this.pswrd&&this.pswrd.length>=8){
      this.sufficientLength=true;
    }
    else{
      this.sufficientLength=false;
    }
  }

  changeInputType(){
    if(this.inputType=='password'){
      this.inputType='text';
      this.eyeIcon='eye-off';
    }
    else{
      this.inputType='password';
      this.eyeIcon='eye';
    }
  }

 async signUp(){
    const loading = await this.loadCtrl.create({
      message: 'Please wait'
    });
    await loading.present();

    //Insert row, Generate code for this user

    if(true){ //if insertion success
      loading.dismiss();
      this.showSuccess();
      this.modalController.dismiss(this.regnum);
    }
    else if(false){ //if row already exists
      loading.dismiss();
      this.pswrd=null;
      this.popAlert('Register number already exists!','','',['Ok']);
    }
    else { //insertion error
      loading.dismiss();
      this.pswrd=null;
      this.popAlert('Something went wrong','Please try again','',['Ok']);
    }
  }
  
  async showSuccess(){
      const toast = await this.toastController.create({
        message: 'Signup Successfull!',
        duration: 3000
      });
      toast.present();
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

  cancel(){
    this.modalController.dismiss();
  }
}

