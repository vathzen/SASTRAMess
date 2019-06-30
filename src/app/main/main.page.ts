import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController, ModalController, NavController, PickerController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
import { RestService } from '../services/rest.service';
import { NetworkService } from '../services/network.service';
import anime from 'node_modules/animejs/lib/anime.js';


@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  private user = {regnum: '', pswrd: '', username:'', contractor:'', messname:''};
  //EVERYTHINGS IS WRT THIS USER, USE CONTEXT OF this.user.regnum for db queries
  public menu= [
    {tag:'tag', tagico: '', icon:'partly-sunny', val:null, isChecked:false, color:'success', oldquantity:0, quantity:0 ,price:null},
    {tag:'tag', tagico: '', icon:'partly-sunny', val:null, isChecked:false, color:'success', oldquantity:0, quantity:0 ,price:null},
    {tag:'tag2', tagico: '', icon:'sunny', val:null, isChecked:false, color:'primary', oldquantity:0, quantity:0 ,price:null},
    {tag:'tag2', tagico: '', icon:'sunny', val:null, isChecked:false, color:'primary', oldquantity:0, quantity:0 ,price:null},
    {tag:'tag3', tagico: '', icon:'moon', val:null, isChecked:false, color:'danger', oldquantity:0, quantity:0 ,price:null},
    {tag:'tag3', tagico: '', icon:'moon', val:null, isChecked:false, color:'danger', oldquantity:0, quantity:0 ,price:null},
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

  constructor(
    private storage: Storage,
    public alertController: AlertController,
    private modalController: ModalController,
    public pickerController: PickerController,
    private restService: RestService,
    private navCtrl: NavController,
    private networkService: NetworkService
    ) { }

  ngOnInit(){
    this.storage.set('navIfNetwork','main');
    this.networkService.checkDisconnection();
  }

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
    this.updatePage().then(()=>{
      this.tryLoading();
    });
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
      this.updatePage(event).then(()=>{
        this.tryLoading(event);
      })
    }, 800);
  }

  async updatePage(event:any=null){
    this.loading+=3;
    this.updateCode(event).then(()=>{
      this.loading--;
      this.tryLoading(event);
    });
    this.updateMenu().then(()=>{
      this.loading--;
      this.tryLoading(event);
    });
    this.checkTimeUp(true);
  }

  tryLoading(event:any=null){
    if(this.loading==0){
      if(event!=null){
        event.target.complete();
      }
      this.slideIn();
    }
  }

  getDate(){
    var serveDate = '2019-07-06 22:59:59' //get server date as yyyy-mm-dd hh:mm:ss
    
    var date_string = new Date(serveDate).toString()
    this.todayDateObj = new Date(date_string);
    this.tmrwDateObj = new Date(this.todayDateObj);
    this.tmrwDateObj.setDate(this.todayDateObj.getDate()+1);
  }

  updateHeader(){
    this.storage.get('reg_num').then(val =>{this.user.regnum=val});
    this.storage.get('pswrd').then(val =>{this.user.pswrd=val});
    this.storage.get('name').then(val =>{this.user.username=val});
    this.storage.get('hostel').then(val =>{this.user.messname=val});
    this.storage.get('contractor').then(val =>{this.user.contractor=val});
  }

  async updateCode(event:any){
    this.todayDate = this.days[this.todayDateObj.getDay()] + '       ' + this.todayDateObj.getDate().toString() + ' ' + this.months[this.todayDateObj.getMonth()] + ' ' + this.todayDateObj.getFullYear().toString();
    //ASSUMING OLDMENU QUERY TAKES BELOW FORM
    //var oldmenu = ['Cornflakes with milk',30,'null','null','Veg. Sandwich',40,'null','null','Kadai Paneer',50,'null','null'];
    //ASSUMING USER BASED QUERY TAKES BELOW FORM
    //var codes = ['AG3K903','null','null','null','AGJJ813','null']; //last 2 digits quantity //today menu code
    this.restService.getOrders(0,this.user.regnum).subscribe(
        (val) => {
            var codes = val.convToObj();
            this.updateCode2(codes).then(()=>{
              this.loading--;
              this.tryLoading(event);
            });
        },
        (err) => {
            console.log(err);
        }
    )
  }

  async updateCode2(codes:any){
      this.restService.getMenu("0").subscribe(
          (val) => {
              var oldmenu = val.convToObj();
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
  }

  async updateMenu(){
    //var menu = ['Cornflakes with milk',30,'null','null','Veg. Sandwich',40,'null','null','Kadai Paneer',50,'null','null']
    this.tmrwDate = this.days[this.tmrwDateObj.getDay()] + '       ' + this.tmrwDateObj.getDate().toString() + ' ' + this.months[this.tmrwDateObj.getMonth()] + ' ' + this.tmrwDateObj.getFullYear().toString();
    this.restService.getMenu("1").subscribe(
        (val) => {
            var menu = val.convToObj();
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
  }

  updateChecks(){
    //var codes = ['null','null','AB3G309','null','null','G3GJJ08'];//tomo menu oda code
    this.restService.getOrders(1,this.user.regnum).subscribe(
        (val) => {
            var codes = val.convToObj();
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
        },
        (err) => {
            console.log(err);
        }
    )
  }

  async showOnesPicker(val:string,quantity:number){
    if(quantity>9){
      this.showTensPicker(val,quantity);
    }
    else{
    const picker = await this.pickerController.create({
      buttons: [{
        text: 'Show x10',
        handler: () => {
          this.showTensPicker(val,10);
        }
      },
      {
        text: 'Cancel',
      },
      {
        text: 'Done',
        handler: (data) => {
          this.menu.forEach(item => {
            if(item.val==val){
                item.quantity=data.quantity_ones.value;
            }
          });
        }
      }
    ],
      columns: [
        {
          name: 'quantity_ones',
          options: [
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
          selectedIndex:quantity-1
        }
      ]
    });
    picker.present();
  }
  }

  async showTensPicker(val:string,quantity:number){
    const picker = await this.pickerController.create({
      buttons: [{
        text: 'Show x1',
        handler: () => {
          this.showOnesPicker(val,1);
        }
      },
      {
        text: 'Cancel',
      },
      {
        text: 'Done',
        handler: (data) => {
          this.menu.forEach(item => {
            if(item.val==val){
                item.quantity=(data.quantity_tens.value*10)+data.quantity_ones.value;
            }
          });
        }
      }],
      columns: [
        {
          name: 'quantity_tens',
          options: [
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
          selectedIndex:(quantity/10)-1
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
            {text: '9',value: 9},
          ],
          columnWidth:'20px',
          selectedIndex:quantity%10
        }
      ]
    });
    picker.present();
  }

  updateOrder(){
    this.checkTimeUp();
    if(!this.disablekey){
      var checkChanged=false;
      this.menu.forEach(item => {
        if(item.quantity!=item.oldquantity){
          checkChanged=true;
        }
      });
      if(checkChanged){
        this.checks.splice(0,this.checks.length);
        this.menu.forEach(item => {
          if(item.val!='null'){
            this.checks.push(item.quantity);
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
    else if(low_item.includes("soup")){
      return 'soup';
    }
    else{
      return 'cloche';
    }
  }

  toggleChecked(val: string){
    if(!this.disablekey){
    this.menu.forEach(item => {
      if(item.val==val){
        var checkcover = document.getElementById('check'+item.val);
        if(item.isChecked){
          item.isChecked=!item.isChecked;
          anime({
            targets: checkcover,
            rotateY: 0,
            duration: 300,
            easing: 'easeInOutSine',
          });
          item.quantity=0;
        }
        else{
          setTimeout(() => {
            item.isChecked=!item.isChecked; 
            anime({
              targets: checkcover,
              rotateY: 180,
              duration: 300,
              easing: 'easeInOutSine',
            });
            if(item.oldquantity!=0){
              item.quantity=item.oldquantity;
            }
            else{
              item.quantity=1;
            }
          }, 320);
        }
      }
    });
  }
  }

  animateCheck(){
    
  }

  checkTimeUp(ignorePullButton:boolean=false){
      if(this.todayDateObj.getHours() > 7 && this.todayDateObj.getHours() < 23 ){
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

  async showNotUpdated(){
    const alert = await this.alertController.create({
      header:'Warning!',
      subHeader:'Your order for this item has not been updated.',
      message:'Press Update Order to update your order.',
      buttons: ['OK']
    });

    await alert.present();
}

  async showCode(val: string){
    var msg = null;
    this.oldmenu.forEach(item => {
      if(item.val==val){
        msg=item.val+'\n'+item.code+'                Quantity: '+item.quantity;
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

  changeNickname(){
    this.storage.set('navToSettingsForName',true);
    this.navCtrl.navigateForward(['settings']);
  }

  ngOnDestroy(){
    this.networkService.disconnectDisconnectSubscription();
  }
}
