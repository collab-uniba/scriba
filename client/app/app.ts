import {Component} from '@angular/core';
import {Platform, ionicBootstrap} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';
import {PersonalPage} from './pages/personal-page/personal-page';
import {enableProdMode} from '@angular/core';
enableProdMode();
@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})

export class MyApp {

  private rootPage:any;

  constructor(private platform:Platform) {
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
      StatusBar.styleDefault();
    });

  }
}

ionicBootstrap(MyApp)
