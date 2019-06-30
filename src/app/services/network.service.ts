import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  constructor(public network: Network, private navCtrl: NavController) { }

  disconnectSubscription=null;
  connectSubscription=null;

  checkDisconnection(){
    this.disconnectSubscription =  this.network.onDisconnect().subscribe(async ()=>{
      this.navCtrl.navigateRoot(['no-internet']);
    });
  }

  checkConnection(page:string){
    this.connectSubscription =  this.network.onConnect().subscribe(()=>{
      setTimeout(async () => {
        this.navCtrl.navigateRoot([page]);
      }, 2000);
    });
  }

  disconnectDisconnectSubscription(){
    if(this.disconnectSubscription){
      this.disconnectSubscription.unsubscribe();
    }
  }

  disconnectConnectSubscription(){
    if(this.connectSubscription){
      this.connectSubscription.unsubscribe();
    }
  }

}
