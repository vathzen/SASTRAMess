import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
  }

}
