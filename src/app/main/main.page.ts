import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  regnum="";
  pswrd="";
  public menu=[
    {tag:'itemtag', icon:'partly-sunny', val:'Masala Dosa', note:'Added!', isChecked:true, color:'success', price:40},
    {tag:'itemtag2', icon:'sunny', val:'Noodles', note:'Add:', isChecked:false, color:'primary', price:40},
    {tag:'itemtag3', icon:'moon', val:'Paneer Fried Rice', note:'Added!', isChecked:true, color:'danger', price:50}
  ];

  constructor(private storage: Storage, public alertController: AlertController) { }

  updateNote(){
      var d = new Date();
      if(d.getHours() > 7 && d.getHours() < 23 ){
          this.menu.forEach(item => {
            if(item.isChecked){
              item.note='Added!';
            }
            else{
              item.note='Add:';
            }
          });
      }else{
          this.timeOut();
      }
  }

  async timeOut(){
      const alert = await this.alertController.create({
        header:'Sorry',
        subHeader:'Orders are now Closed',
        message:'Orders can only be made between 7am to 11pm!',
        buttons: ['OK']
      });

      await alert.present();
  }

  async showCode(){
    //show verification code
    const alert = await this.alertController.create({
      header:'Verification Code',
      subHeader:'Show this code to get your meal!',
      message: this.getCode(),
      buttons: ['OK']
    });

    await alert.present();
  }

  getCode(){
      return Math.random().toString(36).replace('0.','').substr(0,7);
  }

  ngOnInit() {
    this.storage.get('reg_num').then(val =>{this.regnum=val});
    this.storage.get('pswrd').then(val =>{this.pswrd=val});
  }
}
