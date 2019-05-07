import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController, NavController, LoadingController } from '@ionic/angular';
import { RestService } from '../services/rest.service';
import { Response } from '../services/classes';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {

  regnum:"";
  pswrd:"";
  authStatus = new Response();
  constructor(
    public alertController: AlertController,
    private storage: Storage,
    private restService: RestService,
    private navCtrl: NavController,
    private loadCtrl: LoadingController){}

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
         this.storage.set('first_time', 'false');
         this.popAlert('Hey!','Looks like its your first time here','Login with you PWI credentials',['OK']);
      }
   });
  }

  async login(){
    let HostelMap = new Map();
    HostelMap.set("Mega","Leaf and Loaf");
    HostelMap.set("AV","Leaf and Loaf");
    HostelMap.set("KN","Leaf and Loaf");
    HostelMap.set("Vashishta","Bitch Lasagna");
    HostelMap.set("PV","Shitty Bang");
    if((this.regnum==null)||(this.pswrd==null)||(this.regnum=="")||(this.pswrd=="")){
      this.popAlert('Missed Something?','','Fill all fields to continue',['OK']);
    }
    else{
      const loading = await this.loadCtrl.create({
          message: 'Logging In'
      });
      await loading.present();
      this.restService.userAuth(this.regnum,this.pswrd).subscribe(
          (response) => {
              this.authStatus = response;
              if(this.authStatus.Status=="false"){
                loading.dismiss();
                this.popAlert('Typo?','Incorrect register number or password','Please try again',['OK']);
              }
              else{
                //launch next page
                this.storage.set('reg_num', this.regnum);
                this.storage.set('pswrd', this.pswrd);
                this.storage.set('name',this.authStatus.Text.split(",")[0]);
                this.storage.set('hostel',this.authStatus.Text.split(",")[1]);
                this.storage.set('contractor',HostelMap.get(this.authStatus.Text.split(",")[1]));
                loading.dismiss();
                this.navCtrl.navigateRoot(['main']);
              }
          },err => {
              console.log(err);
          }
      );

    }
  }

}
