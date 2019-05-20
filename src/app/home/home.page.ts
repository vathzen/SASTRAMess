import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController, NavController, LoadingController, ModalController } from '@ionic/angular';
import { RestService } from '../services/rest.service';
import { Response } from '../services/classes';
import { SignupPage } from '../signup/signup.page';
import anime from 'node_modules/animejs/lib/anime.js';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {

  regnum:string=null;
  pswrd:string=null;
  verified:boolean=null;
  forgotClicked:boolean=false;
  signupClicked:boolean=false;
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
         this.popAlert('Hey!','Looks like its your first time here','Sign up to start ordering!',['OK']);
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
      this.restService.userAuth(this.regnum,Number(this.pswrd)).subscribe( //pswrd number until you make change in db, use this.verified too
        (response) => {
            this.authStatus = response;
            if(this.authStatus.Status=="false"){
              //loading.dismiss();
              this.popAlert('Typo?','Incorrect register number or password','Please try again',['OK']);
            }
            else{
              //loading.dismiss();
              if(this.authStatus.Text.split(",")[2] == "true"){
                  this.storage.set('first_time', 'false');
                  this.storage.set('reg_num', this.regnum);
                  this.storage.set('pswrd', this.pswrd);
                  this.storage.set('name',this.authStatus.Text.split(",")[0]);
                  this.storage.set('hostel',this.authStatus.Text.split(",")[1]);
                  this.storage.set('contractor','Leaf & Agro');
                  this.navCtrl.navigateRoot(['main']);
              }
              else{
                this.presentEnterCode();
              }
            }
        },err => {
            console.log(err);
        }
    );
    }
  }

  async signUp(){
    const modal = await this.modalController.create({
      component: SignupPage,
      cssClass: 'custom-modal-css'
    });
    modal.present();
    const regnum = await modal.onDidDismiss();
    if(regnum.data){
      this.regnum=regnum.data;
      this.storage.set('first_time', 'false');
      this.presentEnterCode();
    }
  }

  async presentEnterCode() {
    const alert = await this.alertController.create({
      header: 'Enter 4-digit code',
      subHeader: 'To verify it is you, show your ID card to your mess authorities and enter the code they give you',
      message: 'Don\'t worry, it\'s just a one-time process!',
      inputs: [
        {
          name: 'code',
          type: 'number',
          placeholder: 'Enter code',
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
              this.presentEnterCode();
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
      loading.dismiss();
      this.popAlert('You\'re all set!','Login to start ordering.','',['OK']);
    }
    else{
      loading.dismiss();
      this.presentEnterCode();
      this.popAlert('Wrong code','Check your code and try again','',['OK']);
    }
  }

  onForgotClicked(){
    if(!this.forgotClicked){
        anime({
          targets: '.forgotlabel',
          fontSize: 12,
          duration: 200,
          easing: 'easeInOutSine'
        });
        anime({
          targets: '.forgoticon',
          marginRight: 8,
          duration: 20,
        });
      this.forgotClicked=true;
    }
    else{
      anime({
        targets: '.forgotlabel',
        fontSize: 0,
        duration: 200,
        easing: 'easeInOutSine'
      });
      anime({
        targets: '.forgoticon',
        marginRight: 0,
        duration: 20,
      });
    this.forgotClicked=false;
    }
  }

  onSignupClicked(){
    if(!this.signupClicked){
        anime({
          targets: '.signuplabel',
          fontSize: 12,
          duration: 200,
          easing: 'easeInOutSine'
        });
        anime({
          targets: '.signupicon',
          marginLeft: 8,
          duration: 20,
        });
      this.signupClicked=true;
    }
    else{
      anime({
        targets: '.signuplabel',
        fontSize: 0,
        duration: 200,
        easing: 'easeInOutSine'
      });
      anime({
        targets: '.signupicon',
        marginLeft: 0,
        duration: 20,
      });
      this.signupClicked=false;
    }
  }

}
