import {Component} from '@angular/core';
import {HomePage} from '../home-page/home-page';
import {AboutPage} from '../about-page/about-page';
import {ContactPage} from '../contact-page/contact-page';
import{SignupPage} from '../modals/signup/signup-modal';
import{LoginPage} from '../modals/login/login-modal';
import {Platform, Modal, NavController} from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/tabs/tabs.html'
})

export class TabsPage {

  private tab1Root: any;
  private tab2Root: any;
  private tab3Root: any;

  constructor(private nav: NavController, private platform: Platform) {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.tab1Root = HomePage;
    this.tab2Root = AboutPage;
    this.tab3Root = ContactPage;
    console.log(platform);
    console.log(platform.is("android"));
  }

  login(){
    let modal = Modal.create(LoginPage);
    this.nav.present(modal);
  }
  signUp(){
    let modal = Modal.create(SignupPage);
    this.nav.present(modal);
  }
}
