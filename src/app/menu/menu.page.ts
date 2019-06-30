import { Component, OnInit } from '@angular/core';
import { NetworkService } from '../services/network.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  public menu = [
      {
          tag:'menutag1', icon:'partly-sunny', val:'Pongal, Medhu Vada'
      },
      {
          tag:'menutag2', icon:'sunny', val:'Chapati, Channa Masala'
      },
      {
          tag:'menutag3', icon:'moon', val:'Paneer Fried Rice'
      }
  ]

  constructor(private networkService: NetworkService, private storage: Storage) { }

  ngOnInit() {
    this.storage.set('navIfNetwork','menu');
    this.networkService.checkDisconnection();
  }

  ngOnDestroy(){
    this.networkService.disconnectDisconnectSubscription();
  }

}
