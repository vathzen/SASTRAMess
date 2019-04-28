import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/main',
      icon: 'home',
      direction: 'root'
    },
    {
      title: 'Menu',
      url: '/menu',
      icon: 'menu',
      direction: 'forward'
    },
    {
      title: 'History',
      url: '/history',
      icon: 'time',
      direction: 'forward'
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: 'settings',
      direction: 'forward'
    },
    {
      title: 'Log Out',
      url: '/home',
      icon: 'power',
      direction: 'root'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
