import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { NetworkService } from '../services/network.service';
import { ForgotPage } from '../forgot/forgot.page';
import { Storage } from '@ionic/storage';
import { RestService } from '../services/rest.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(public alertController: AlertController, private storage: Storage, private networkService: NetworkService,private restService: RestService) { }

  constructor(public alertController: AlertController, private storage: Storage, private networkService: NetworkService,private modalController: ModalController,private restService: RestService) { }


  ngOnInit() {
    this.storage.set('navIfNetwork','settings');
    this.networkService.checkDisconnection();
    this.storage.get('navToSettingsForName').then(forName =>{
      if(forName){
        this.showChangeName();
      }
    });
  }

  showChangePassword(){
    this.storage.get('reg_num').then((regnum)=>{
      this.storage.get('pswrd').then(async (pswrd)=>{
        const modal = await this.modalController.create({
          component: ForgotPage,
          componentProps : {regnum: regnum, pswrd: pswrd},
          cssClass: 'custom-modal-css'
        });
        modal.present();
        await modal.onDidDismiss();
        const newpw = await modal.onDidDismiss();
        if(newpw.data){
          this.storage.set('pswrd', newpw.data);
        }
      })
    })
  }

  async showChangeName(){
    let nickname = null;
    this.storage.get('name').then(async nickname =>{
      const alert = await this.alertController.create({
        header: 'Enter a nickname',
        subHeader: 'Current nickname: ' + nickname,
        inputs: [
          {
            name: 'name',
            type: 'text',
            placeholder: 'Enter name',
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          }, {
            text: 'Apply',
            handler: (data) => {
              if(data.name){
                //update name in db
                this.storage.get('reg_num').then((val) =>{
                    this.restService.changeNickname(val,data.name).subscribe(
                        (val) => {
                            if(val.Status == "true"){
                                this.storage.set('name', data.name);
                            }
                        }
                    )
                })
              }
              else{
                this.showChangeName();
              }
            }
          }
        ]
      });

      await alert.present();
    });

  }

  ionViewWillLeave(){
    this.storage.set('navToSettingsForName',false);
  }

  ngOnDestroy(){
    this.networkService.disconnectDisconnectSubscription();
  }

}
