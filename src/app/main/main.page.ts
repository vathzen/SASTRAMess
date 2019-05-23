import { Component, AfterViewInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController, ModalController, PickerController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
import { RestService } from '../services/rest.service';
import { Menu } from '../services/classes';
import anime from 'node_modules/animejs/lib/anime.js';


@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements AfterViewInit {
  private user = {regnum: '', pswrd: '', username:'', contractor:'', messname:''};
  todayMenu = new Menu();
  //EVERYTHINGS IS WRT THIS USER, USE CONTEXT OF this.user.regnum for db queries
  public menu= [
    {tag:'tag', tagico: '', icon:'partly-sunny', val:null, isChecked:false, color:'success', quantity:0 ,price:null},
    {tag:'tag', tagico: '', icon:'partly-sunny', val:null, isChecked:false, color:'success', quantity:0 ,price:null},
    {tag:'tag2', tagico: '', icon:'sunny', val:null, isChecked:false, color:'primary', quantity:0 ,price:null},
    {tag:'tag2', tagico: '', icon:'sunny', val:null, isChecked:false, color:'primary', quantity:0 ,price:null},
    {tag:'tag3', tagico: '', icon:'moon', val:null, isChecked:false, color:'danger', quantity:0 ,price:null},
    {tag:'tag3', tagico: '', icon:'moon', val:null, isChecked:false, color:'danger', quantity:0 ,price:null},
  ];
  public oldmenu=[
    {tag:'tag', tagico: '', icon:'partly-sunny', val:null, code:null, quantity:null, color:'success'},
    {tag:'tag', tagico: '', icon:'partly-sunny', val:null, code:null, quantity:null, color:'success'},
    {tag:'tag2', tagico: '', icon:'sunny', val:null, code:null, quantity:null, color:'primary'},
    {tag:'tag2', tagico: '', icon:'sunny', val:null, code:null, quantity:null, color:'primary'},
    {tag:'tag3', tagico: '', icon:'moon', val:null, code:null, quantity:null, color:'danger'},
    {tag:'tag3', tagico: '', icon:'moon', val:null, code:null, quantity:null, color:'danger'},
  ];
  public days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  public months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  animating:boolean=true;
  loading:number=0;
  updateButtonPulled:boolean=false;
  checks = [];
  disablekey:boolean=false;
  checkChanged:boolean=false;
  todayDateObj:Date=null;
  tmrwDateObj:Date=null;
  todayDate:string=null;
  tmrwDate:string=null;

  constructor(private storage: Storage, public alertController: AlertController, private modalController: ModalController, public pickerController: PickerController, private restService: RestService) { }

  ngAfterViewInit(){
    anime({
      targets: '.transparent',
      translateY: 65,
      duration: 1,
      easing: 'easeInOutSine'
    });
    this.getDate();
  }

  ionViewWillEnter(){
    this.updateHeader();
    this.updatePage();
  }

  ionViewWillLeave(){
    this.slideOut();
  }

  slideIn(){
    var self=this;
    this.animating=true;
    anime({
      targets: '.card1margin, .card2margin',
      marginLeft: '0.5%',
      duration: 400,
      easing: 'easeInOutSine',
      complete: function() {
        startAnim();
      }
    });
    function startAnim(){
      anime({
        targets: '.head',
        marginTop: 0,
        duration: 300,
        easing: 'easeInOutSine'
      });
      if(!self.disablekey){ //Writing again here instead of using pull() for impeccable timing on animations
      anime({
        targets: '.transparent',
        translateY: 0,
        duration: 300,
        easing: 'easeInOutSine'
      });
      self.updateButtonPulled=false;
      }
      else{
        self.updateButtonPulled=true;
      }
      anime({
        targets: '.itemparent',
        width: '100%',
        duration: 800,
        complete: function() {
          self.animating=false;
        }
      });
    }
  }

  setButtonPos(){
    if(!this.disablekey){
      anime({
        targets: '.transparent',
        translateY: 0,
        duration: 300,
        easing: 'easeInOutSine'
      });
      this.updateButtonPulled=false;
    }
    else{
      anime({
        targets: '.transparent',
        translateY: 65,
        duration: 300,
        easing: 'easeInOutSine'
      });
      this.updateButtonPulled=true;
    }
  }

  slideOut(){
    var self=this;
    this.animating=true;
    anime({
      targets: '.head',
      marginTop: -65,
      duration: 300,
      easing: 'easeInOutSine'
    });
    anime({
      targets: '.card1margin',
      marginLeft: '-120%',
      duration: 400,
      easing: 'easeInOutSine'
    });
    anime({
      targets: '.card2margin',
      marginLeft: '120%',
      duration: 400,
      easing: 'easeInOutSine'
    });
    anime({
      targets: '.transparent',
      translateY: 65,
      duration: 300,
      easing: 'easeInOutSine'
    });
    anime({
      targets: '.itemparent',
      width: '0%',
      duration: 800,
      complete:function(){
        self.animating=false;
      }
    });
  }

  doRefresh(event:any) {
    this.slideOut();
    setTimeout(() => {
      this.updatePage(event);
    }, 800);
  }

  updatePage(event:any=null){   //call func - read from db, modify list size, update list values
    this.updateCode();
    this.updateMenu();
    this.checkTimeUp(true);
    while(this.loading!=0){} //Loading....
      if(event!=null){
        event.target.complete();
      }
      this.slideIn();
  }

  getDate(){
    var date_string = new Date().toString() //get today's date as date obj string

    this.todayDateObj = new Date(date_string);
    this.tmrwDateObj = new Date(this.todayDateObj);
    this.tmrwDateObj.setDate(this.todayDateObj.getDate()+1);
  }

  updateHeader(){
    this.loading++;
    this.storage.get('reg_num').then(val =>{this.user.regnum=val});
    this.storage.get('pswrd').then(val =>{this.user.pswrd=val});
    this.storage.get('name').then(val =>{this.user.username=val});
    this.storage.get('hostel').then(val =>{this.user.messname=val});
    this.storage.get('contractor').then(val =>{this.user.contractor=val});
    this.loading--;
  }

  //**********SERVER MAINTAINS TODAY'S DATE AND TIME OBJ***********
  updateCode(){
    this.loading++;
    this.todayDate = this.days[this.todayDateObj.getDay()] + '       ' + this.todayDateObj.getDate().toString() + ' ' + this.months[this.todayDateObj.getMonth()] + ' ' + this.todayDateObj.getFullYear().toString();

    //ASSUMING OLDMENU QUERY TAKES BELOW FORM
    //var oldmenu = ['Cornflakes with milk',30,'null','null','Veg. Sandwich',40,'null','null','Kadai Paneer',50,'null','null'];
    this.restService.getMenu("0").subscribe(
        (val) => {
            this.todayMenu = val;
            var oldmenu = this.todayMenu.convToObj();
            var i=0;
            this.oldmenu.forEach(item => {
              if(oldmenu[i]!='null'){
                item.val=oldmenu[i];
                item.code=codes[i/2];
                item.tagico=this.iconDetect(item.val);//run icon detection
                item.quantity=item.code[5]+item.code[6];
              }
              i+=2;
            });
        },
        (err) => {
            console.log(err);
        }
    )
    //ASSUMING USER BASED QUERY TAKES BELOW FORM
    var codes = ['AG3K903','null','null','null','AGJJ813','null']; //last 2 digits quantity //today menu code
    this.loading--;
  }

  updateMenu(){
    this.loading++;
    this.tmrwDate = this.days[this.tmrwDateObj.getDay()] + '       ' + this.tmrwDateObj.getDate().toString() + ' ' + this.months[this.tmrwDateObj.getMonth()] + ' ' + this.tmrwDateObj.getFullYear().toString();

    this.restService.getMenu("1").subscribe(
        (val) => {
            this.todayMenu = val;
            var menu = this.todayMenu.convToObj();
            var i=0;
            this.menu.forEach(item => {
              if(menu[i]!='null'){
                item.val=menu[i];
                item.price=menu[i+1];
                item.tagico=this.iconDetect(item.val);//run icon detection
              }
              i+=2;
            });
        },
        (err) => {
            console.log(err);
        }
    )
    this.updateChecks();
    this.loading--;
  }

  updateChecks(){
    //GET ROW OF CODES FROM DB
    var codes = ['null','null','AB3G309','null','null','G3GJJ08']; //ASSUMING WE GET THIS //tomo menu oda code
    var i = 0;
    this.menu.forEach(item => {
      if(codes[i]!='null'){
        item.isChecked=true;
        item.quantity=Number(codes[i][5]+codes[i][6]);
      }
      else{
        item.isChecked=false;
      }
      i++;
    });
    this.checkChanged=false;
  }

  async showPicker(val:string){
    const picker = await this.pickerController.create({
      buttons: [{
        text: 'Cancel',
      },
      {
        text: 'Done',
        handler: (data) => {
          this.menu.forEach(item => {
            if(item.val==val){
              if(item.quantity!=((data.quantity_tens.value*10)+data.quantity_ones.value)){
                item.quantity=(data.quantity_tens.value*10)+data.quantity_ones.value;
                this.checkChanged=true;
              }
            }
          });
        }
      }],
      columns: [
        {
          name: 'quantity_tens',
          options: [
            {text: '0', value: 0},
            {text: '1', value: 1},
            {text: '2',value: 2},
            {text: '3',value: 3},
            {text: '4',value: 4},
            {text: '5',value: 5},
            {text: '6',value: 6},
            {text: '7',value: 7},
            {text: '8',value: 8},
            {text: '9',value: 9}
          ],
          columnWidth:'20px',
        },{
          name: 'quantity_ones',
          options: [
            {text: '0', value: 0},
            {text: '1', value: 1},
            {text: '2',value: 2},
            {text: '3',value: 3},
            {text: '4',value: 4},
            {text: '5',value: 5},
            {text: '6',value: 6},
            {text: '7',value: 7},
            {text: '8',value: 8},
            {text: '9',value: 9}
          ],
          columnWidth:'20px',
          selectedIndex:1
        }
      ]
    });
    picker.present();
  }

  updateOrder(){
    this.checkTimeUp();
    if(!this.disablekey){
      if(this.checkChanged){
        this.checks.splice(0,this.checks.length);
        this.menu.forEach(item => {
          if(item.val!='null'){
            this.checks.push(item.isChecked);
          }
        });
        this.openModal();
      }
    }
    else{
      this.showTimeUp();
    }
  }

  async openModal(){
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {checks: this.checks},
      backdropDismiss: false,
      cssClass: 'custom-modal-css'
    });
    modal.present();
    const updateSuccess = await modal.onDidDismiss();
    if(updateSuccess.data){
      this.updateChecks();
    }
  }

  iconDetect(item: string){
    var low_item = item.toLowerCase();
    if(low_item.includes("dosa")||low_item.includes("uthappam")){
      return 'dosa';
    }
    else if(low_item.includes("noodle")){
      return 'noodle';
    }
    else if(low_item.includes("rice")){
      return 'rice';
    }
    else if(low_item.includes("flake")){
      return 'flake';
    }
    else if(low_item.includes("sandwich")){
      return 'sandwich';
    }
    else if(low_item.includes("french")){
      return 'fries';
    }
    else if(low_item.includes("chilly")||low_item.includes("manchurian")||low_item.includes("kadai")){
      return 'chilly';
    }
    else{
      return 'cloche';
    }
  }

  toggleChecked(val: string){
    if(!this.disablekey){
    this.checkChanged=true;
    this.menu.forEach(item => {
      if(item.val==val){
        item.isChecked=!item.isChecked;
        if(item.isChecked){
          item.quantity=1;
        }
        else{
          item.quantity=0;
        }
      }
    });
  }
  }

  checkTimeUp(ignorePullButton:boolean=false){//use time obj from server *VERY VITAL* generate codes in server before 12:00am
    var d = new Date();
      if(d.getHours() > 7 && d.getHours() < 23 ){
        this.disablekey=false;
      }
      else{
          this.disablekey=true;
      }
    if(!ignorePullButton){
      this.setButtonPos();
    }
  }

  async showTimeUp(){
      const alert = await this.alertController.create({
        header:'Sorry',
        subHeader:'Orders are now Closed',
        message:'Orders can only be made between 7am to 11pm!',
        buttons: ['OK']
      });

      await alert.present();
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
    var msg = null;
    this.oldmenu.forEach(item => {
      if(item.val==val){
        msg=item.val+'\n\n'+item.code+'                Quantity: '+item.quantity;
      }
    });
    //show verification code
    const alert = await this.alertController.create({
      header:'Verification Code',
      subHeader:'Show this code to get your meal!',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }
}
