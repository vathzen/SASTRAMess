import { Component, OnInit, Input } from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController} from '@ionic/angular';
import { RestService } from '../services/rest.service';
import { Response } from '../services/classes';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  @Input() forgotPassword: any[];

  constructor( public alertController: AlertController, private loadCtrl: LoadingController, private modalController: ModalController, public toastController: ToastController, public  restService: RestService ) { }

  regnum:string=null; //do not change regnum to type number
  pswrd:string=null;
  name:string=null;
  regnumValid:number=null;
  timeVar:any=null;
  inputType:string='password';
  eyeIcon:string='eye';
  sufficientLength:boolean=null;
  authStatus = new Response();

  ngOnInit() {
  }

  regnumInputChanged(){
    clearTimeout(this.timeVar);
    if(this.regnum){ //only if not null
    this.regnum=this.regnum.toString();
    }
    if(this.regnum&&this.regnum.length==9){
     this.restService.getExist(this.regnum).subscribe(
         (val) => {
             if(val.Status == "true"){ //if regnum exists in pwi
               if(this.forgotPassword){ //if forgot password
                 //check if regnum exists in db too
                 if(val.Text == "true"){ //if regnum already exists in our db
                   this.regnumValid=1;
                 }
                 else{ //if regnum does not exist in our db
                   this.regnumValid=-1;
                 }
               }
               else{ //if not forgot password
                 //check if regnum exists in db too
                 if(val.Text == "true"){//if regnum already exists in our db
                   this.regnumValid=-1;
                 }
                 else{  //if regnum does not exist in our db
                   this.regnumValid=1;
                 }
               }
             }
             else{
               this.regnumValid=-1;
             }
         }
     )

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

    if(this.forgotPassword){ //logic for forgot password
      //find that regnum and simply change to new password... no need to delete and insert
    }

    else{//logic for signup
      this.restService.newUser(Number(this.regnum),this.pswrd,this.name).subscribe(
        response => {
            loading.dismiss();
            this.authStatus = response;
            if(this.authStatus.Status == "OK"){ //if insertion success
              this.showSuccess();
              this.modalController.dismiss(this.regnum);
            }
            else { //insertion error
              loading.dismiss();
              this.pswrd=null;
              this.popAlert('Something went wrong','Please try again','',['Ok']);
            }
        }
      );
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
