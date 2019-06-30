import { Component, OnInit } from '@angular/core';
import { NetworkService } from '../services/network.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {

  constructor(private networkService: NetworkService, private storage: Storage) { }

  ngOnInit() {
    this.storage.set('navIfNetwork','history');
    this.networkService.checkDisconnection();
  }

  ngOnDestroy(){
    this.networkService.disconnectDisconnectSubscription();
  }

}
