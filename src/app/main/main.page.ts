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
    {tag:'itemtag', icon:'partly-sunny', val:'Masala Dosa', note:'Added!', isChecked:true, color:'success'},
    {tag:'itemtag2', icon:'sunny', val:'Noodles', note:'Add:', isChecked:false, color:'primary'},
    {tag:'itemtag3', icon:'moon', val:'Paneer Fried Rice', note:'Added!', isChecked:true, color:'danger'}
  ];

  constructor(private storage: Storage, public alertController: AlertController) { }

  updateNote(){
    this.menu.forEach(item => {
      if(item.isChecked){
        item.note='Added!';
      }
      else{
        item.note='Add:';
      }
    });
  }

  async showCode(){
    //show verification code
    const alert = await this.alertController.create({
      header:'Verification Code',
      subHeader:'Show this code to get your meal!',
      message:'VX2H8L',
      buttons: ['OK']
    });

    await alert.present();
  }

  ngOnInit() {
    this.storage.get('reg_num').then(val =>{this.regnum=val});
    this.storage.get('pswrd').then(val =>{this.pswrd=val});
  }
}

