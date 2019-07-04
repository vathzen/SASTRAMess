import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.page.html',
  styleUrls: ['./forgot.page.scss'],
})
export class ForgotPage implements OnInit {

  @Input() regnum: any[];
  @Input() pswrd: any[];

  constructor(private modalController: ModalController, public toastController: ToastController) { }

  inputType:string='password';
  eyeIcon:string='eye';
  oldpw:string=null;
  newpw:string=null;
  confpw:string=null;
  sufficientLength:boolean=null;

  ngOnInit() {
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

  pswrdInputChanged(){
    if(this.newpw&&this.newpw.length>=8){
      this.sufficientLength=true;
    }
    else{
      this.sufficientLength=false;
    }
  }

  updatePassword(){
    //update password using this.regnum and this.newpw
    if(true){
      this.showToast('Password changed successfully!');
      this.modalController.dismiss(this.newpw);
    }
    else{
      this.showToast('Something went wrong');
    }
  }

  async showToast(message:string){
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
}

  cancel(){
    this.modalController.dismiss();
  }

}
