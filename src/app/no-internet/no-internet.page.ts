import { Component, OnInit } from '@angular/core';
import { NetworkService } from '../services/network.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-no-internet',
  templateUrl: './no-internet.page.html',
  styleUrls: ['./no-internet.page.scss'],
})
export class NoInternetPage implements OnInit {

  constructor(private storage: Storage, private networkService: NetworkService) { }

  ngOnInit() {
    this.storage.get('navIfNetwork').then(page =>{
      this.networkService.checkConnection(page);  
  })
  }

  ngOnDestroy(){
    this.networkService.disconnectConnectSubscription();
  }

}
