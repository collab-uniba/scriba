import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { PersonalPage } from '../pages/personal-page/personal-page';
import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
     if(window.localStorage.getItem("token")){
      this.rootPage = PersonalPage;
    }else{
      this.rootPage = TabsPage;
    }
    if(platform.is("android")){
      window.localStorage.setItem("platform", "android");
    }
    if(platform.is("ios")){
      window.localStorage.setItem("platform", "ios");
    }

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

