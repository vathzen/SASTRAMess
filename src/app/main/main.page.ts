import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController, ModalController, NavController, PickerController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
import { RestService } from '../services/rest.service';
import { NetworkService } from '../services/network.service';
import anime from 'node_modules/animejs/lib/anime.js';
import { FormMenuItems } from '../services/classes';


@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  private user = {regnum: '', pswrd: '', username:'', contractor:'', messname:''};
  //EVERYTHINGS IS WRT THIS USER, USE CONTEXT OF this.user.regnum for db queries
  public menu=[];
  public oldmenu =[];
  public days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  public months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  public items = null;
  animating:boolean=true;
  updateButtonPulled:boolean=false;
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
  }

  ionViewWillEnter(){
    this.getDate();
  }

  async getDate(){
    //var serveDate = '2019-07-06 22:59:59' //get server date as yyyy-mm-dd hh:mm:ss
    this.restService.getStatus().subscribe(
        (val) => {
            console.log(val);
            var serveDate = val.Text;
            var date_string = new Date(serveDate).toString();
            this.todayDateObj = new Date(date_string);
            this.tmrwDateObj = new Date(this.todayDateObj);
            this.tmrwDateObj.setDate(this.todayDateObj.getDate()+1);
            this.updateHeader();
        },
        (err) => {
            console.log(err);
        }
    )
  }

  updateHeader(){
      this.storage.get('reg_num').then(val =>{
          this.user.regnum=val;
          this.getItemsData();
      });
      this.storage.get('name').then(val =>{this.user.username=val});
      this.storage.get('hostel').then(val =>{this.user.messname=val});
      this.storage.get('contractor').then(val =>{this.user.contractor=val});
  }

  getItemsData(){
    var data = 'Veg Salad:20:false,Dosa:40:false,Mushroom 65:40:false,Babycorn 65:47:false,Paneer 65:47:true,Noodles:40:false,Fruit Juice:30:false';
    this.items = new FormMenuItems().formItemsObject(data);
    this.updatePage(); //call on rcv items data
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

  updatePage(event:any=null){
    this.oldmenu=[];
    this.menu=[];

    var data =    //TODAY TMRW MENU3,ORDERS FORMAT
    {
      "tbf":"01-ADRFX06",
      "tlun":"02-null",
      "tsnx":"",
      "tdin":"03-FRSFX04",
      "nbf":"01-null",
      "nlun":"04-null",
      "nsnx":"01-ADRFX06",
      "ndin":"03-FRSFX04"
    };

    var i = 0;
    Object.keys(data).forEach(key => {
      data[key].split(',').forEach((element: string) => {
        if(element){
          this.formMenu(element,i++,key);
        }
      });
    });
    this.checkTimeUp(true);
    this.todayDate = this.days[this.todayDateObj.getDay()] + '       ' + this.todayDateObj.getDate().toString() + ' ' + this.months[this.todayDateObj.getMonth()] + ' ' + this.todayDateObj.getFullYear().toString();
    this.tmrwDate = this.days[this.tmrwDateObj.getDay()] + '       ' + this.tmrwDateObj.getDate().toString() + ' ' + this.months[this.tmrwDateObj.getMonth()] + ' ' + this.tmrwDateObj.getFullYear().toString();
    if(event!=null){
      event.target.complete();
    }
    this.slideIn();
  }

  formMenu(element: string, i: number, key:string){
    var split = element.split('-');
    var id:number = +split[0];
    var name:string = this.items[id].name;
    var tag:string = null;
    var icon:string = null;
    var color:string = null;
    var type:string = key.slice(1);
    if(type=='bf'){
      tag = 'tag'; icon = 'partly-sunny'; color = 'success';
    }
    else if(type=='lun'){
      tag = 'tag2'; icon = 'sunny'; color = 'danger';
    }
    else if(type=='lun'){
      tag = 'tag3'; icon = 'pizza'; color = 'primary';
    }
    else {
      tag = 'tag4'; icon = 'moon'; color = 'dark';
    }
    if(key[0]=='t'){
      this.oldmenu.push({i: i, id: id, tag:tag, tagico: this.iconDetect(name), icon:icon, val:name, code:split[1], quantity:Number(split[1][5]+split[1][6]), color:color});
    }
    else{
      var cost:number = this.items[id].cost;
      var quantity:number = (split[1]=='null')?0:Number(split[1][5]+split[1][6]);
      this.menu.push({i: i, id: id, tag:tag, tagico: this.iconDetect(name), icon:icon, val:name, isChecked:quantity, color:color, oldquantity:quantity, quantity:quantity , price:cost});
    }
  }

  async showOnesPicker(i:number,quantity:number){
    if(quantity>9){
      this.showTensPicker(i,quantity);
    }
    else{
    const picker = await this.pickerController.create({
      buttons: [{
        text: 'Show x10',
        handler: () => {
          this.showTensPicker(i,10);
        }
      },
      {
        text: 'Cancel',
      },
      {
        text: 'Done',
        handler: (data) => {
          this.menu.forEach(item => {
            if(item.i==i){
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

  async showTensPicker(i:number,quantity:number){
    const picker = await this.pickerController.create({
      buttons: [{
        text: 'Show x1',
        handler: () => {
          this.showOnesPicker(i,1);
        }
      },
      {
        text: 'Cancel',
      },
      {
        text: 'Done',
        handler: (data) => {
          this.menu.forEach(item => {
            if(item.i==i){
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
        var checks =
        {
          "nbf":"",
          "nlun":"",
          "nsnx":"",
          "ndin":""
        };
        this.menu.forEach(item => {
          if(item.val!='null'){
            if(item.tag=='tag'){
              checks.nbf = String(item.id)+'-'+String(item.quantity)+','
            }
            else if(item.tag=='tag2'){
              checks.nlun = String(item.id)+'-'+String(item.quantity)+','
            }
            else if(item.tag=='tag3'){
              checks.nsnx = String(item.id)+'-'+String(item.quantity)+','
            }
            else{
              checks.ndin = String(item.id)+'-'+String(item.quantity)+','
            }
          }
        });
        this.openModal(checks);
      }
    }
    else{
      this.showTimeUp();
    }
  }

  async openModal(checks: { "nbf": string; "nlun": string; "nsnx": string; "ndin": string; }){
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {checks: checks},
      backdropDismiss: false,
      cssClass: 'custom-modal-css'
    });
    modal.present();
    const updateSuccess = await modal.onDidDismiss();
    if(updateSuccess.data){
      this.updatePage();
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

  toggleChecked(i: number){
    if(!this.disablekey){
    this.menu.forEach(item => {
      if(item.i==i){
        var checkcover = document.getElementById('check'+item.i);
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

  async showCode(i: number){
    var msg = null;
    this.oldmenu.forEach(item => {
      if(item.i==i){
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
