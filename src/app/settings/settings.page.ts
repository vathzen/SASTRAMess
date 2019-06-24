import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { NetworkService } from '../services/network.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(public alertController: AlertController, private storage: Storage, private networkService: NetworkService) { }

  ngOnInit() {
    this.storage.set('navIfNetwork','settings');
    this.networkService.checkDisconnection();
    this.storage.get('navToSettingsForName').then(forName =>{
      if(forName){
        this.showChangeName();
      }
    });
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
                this.storage.set('name', data.name);
                //update name in db
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
