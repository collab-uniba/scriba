import {Component} from '@angular/core';
import {HomePage} from '../home-page/home-page';
import {AboutPage} from '../about-page/about-page';
import {ContactPage} from '../contact-page/contact-page';
import{SignupPage} from '../modals/signup/signup-modal';
import{LoginPage} from '../modals/login/login-modal';
import {ModalController, NavController} from 'ionic-angular';

@Component({
  templateUrl: 'tabs.html'
})

export class TabsPage {
  private mobile=window.localStorage.getItem("platform");

  private tab1Root: any;
  private tab2Root: any;
  private tab3Root: any;

  constructor(private nav: NavController, private modalCtrl:ModalController) {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.tab1Root = HomePage;
    this.tab2Root = AboutPage;
    this.tab3Root = ContactPage;
  }

  login(){
    let modal = this.modalCtrl.create(LoginPage);
    modal.present();
  }
  signUp(){
    let modal = this.modalCtrl.create(SignupPage);
      modal.present();
  }
}
