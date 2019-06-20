import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(public alertController: AlertController, private storage: Storage) { }

  ngOnInit() {
    let forName = this.storage.get('navToSettingsForName');
    if(forName){
      this.showChangeName();
    }
  }

  async showChangeName(){
    const alert = await this.alertController.create({
      header: 'Enter a nickname',
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
  }

}
