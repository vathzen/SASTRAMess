import { Component, OnInit, AfterViewChecked, AfterViewInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit{

  private user={regnum:'', pswrd:'', username:'', contractor:'', messname:''};
  //EVERYTHINGS IS WRT THIS USER, USE CONTEXT OF this.user.regnum for db queries
  public menu=[
    {tag:'itemtag', icon:'partly-sunny', val:'Masala Dosa', note:'Added!', isChecked:true, color:'success', price:40},
    {tag:'itemtag2', icon:'sunny', val:'Noodles', note:'Add:', isChecked:false, color:'primary', price:40},
    {tag:'itemtag3', icon:'moon', val:'Paneer Fried Rice', note:'Added!', isChecked:true, color:'danger', price:50}
  ];
  public oldmenu=[
    {tag:'itemtag', icon:'partly-sunny', val:'Old Masala Dosa', hasOrdered:true, code:'ksjdgh', color:'success'},
    {tag:'itemtag2', icon:'sunny', val:'Old Noodles', hasOrdered:false, code:'sjffdd', color:'primary'},
    {tag:'itemtag3', icon:'moon', val:'Old Masala Dosa', hasOrdered:true, code:'sdjfsd', color:'danger'}
  ];
  disablekey=false;

  constructor(private storage: Storage, public alertController: AlertController) { }

  updateHeader(){
    this.storage.get('reg_num').then(val =>{this.user.regnum=val});
    this.storage.get('pswrd').then(val =>{this.user.pswrd=val});
    this.user.username='Shrihari' //GET NAME FROM PWI
    this.user.contractor='Leaf & Agro' //GET CONTRACTOR FROM DB
    this.user.messname='Mega Hostel Mess' //Get messname for given regnum
  }

  //**********SERVER MAINTAINS TODAY'S DATE AND TIME OBJ***********
  updateCode(){
    var num=null,date=null;
    num=1;//find and store size of meal count
    date=19;//get and store today's date
    this.oldmenu.splice(0,this.oldmenu.length);
    for (let i = 0; i < num; i++)
    {
    this.oldmenu.push({tag:'itemtag', icon:'partly-sunny', val:'', hasOrdered:false, code:'', color:'success'});
    }
    //detect no. of lunch and store it in num
    for (let i = 0; i < num; i++)
    {
    this.oldmenu.push({tag:'itemtag2', icon:'sunny', val:'', hasOrdered:false, code:'', color:'primary'});
    }
    //detect no. of dinner and store it in num
    for (let i = 0; i < num; i++)
    {
    this.oldmenu.push({tag:'itemtag3', icon:'moon', val:'', hasOrdered:false, code:'', color:'danger'});
    }
    //updation starts
    this.oldmenu.forEach(item => {
      item.val='New Val!';//get new val from db
      item.code='abcdef';//check if code exists in db and store here
      item.hasOrdered=(item.code!='');
    });
  }

  updateMenu()
  { var num=null,date=null;
    num=2;//find and store size of meal count
    date=20//get and store tomorrow's date (tmrw date = today date + 1 [careful month and year change])
    this.menu.splice(0,this.menu.length);
    //detect no. of brkfast and store it in num
    for (let i = 0; i < num; i++)
    {
    this.menu.push({tag:'itemtag', icon:'partly-sunny', val:'', note:'', isChecked:false, color:'success', price:null});
    }
    //detect no. of lunch and store it in num
    for (let i = 0; i < num; i++)
    {
    this.menu.push({tag:'itemtag2', icon:'sunny', val:'', note:'', isChecked:false, color:'primary', price:null});
    }
    //detect no. of dinner and store it in num
    for (let i = 0; i < num; i++)
    {
    this.menu.push({tag:'itemtag3', icon:'moon', val:'', note:'', isChecked:false, color:'danger', price:null});
    }
    //updation starts
    this.menu.forEach(item => {
      item.val='New Val!';//get new val from db
      item.note='Add:';
      item.isChecked=false;
      item.price=50;//get new price from db
    });
  }

  toggleChecked(val: string){
    this.menu.forEach(item => {
      if(item.val==val){
        item.isChecked=!item.isChecked;
      }
    });
  }

  updateOrder(){
      this.checkTimeUp();
      if(!this.disablekey){
          this.menu.forEach(item => {
            if(item.isChecked){ //ORDER MUST BE UPDATED, CODE MUST BE GENERATED AND STORED IN DB
              item.note='Added!';  //IF SUCCESSFUL, NOTE SHOULD BE CHANGED
            }
            else{
              item.note='Add:';//DISPLAY ERROR ALERT IF NOT SUCCESSFUL
            }
          });
      }else{
          this.showTimeout();
      }
  }

  checkTimeUp(){//use time obj from server
    var d = new Date();
      if(d.getHours() > 7 && d.getHours() < 23 ){
        this.disablekey=false;
      }
      else{
          this.disablekey=true;
      }
  }

  async showTimeout(){
      const alert = await this.alertController.create({
        header:'Sorry',
        subHeader:'Orders are now Closed',
        message:'Orders can only be made between 7am to 11pm!',
        buttons: ['OK']
      });

      await alert.present();
  }

  async showCode(val: string){
    var code = '';
    this.oldmenu.forEach(item => {
      if(item.val==val){
        code=item.code;
      }
    });
    //show verification code
    const alert = await this.alertController.create({
      header:'Verification Code',
      subHeader:'Show this code to get your meal!',
      message: code,
      buttons: ['OK']
    });

    await alert.present();
  }

  /*getCode(){
      return Math.random().toString(36).replace('0.','').substr(0,7);
  }*/

  ngOnInit() {
    this.updateHeader();
    //call func - read from db, modify list size, update list values
    this.updateCode();
    this.updateMenu();
    this.checkTimeUp();
  }
}
