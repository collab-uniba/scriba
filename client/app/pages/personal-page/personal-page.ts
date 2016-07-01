import {Component} from '@angular/core'
import {HomePage} from '../home-page/home-page';
import {AboutPage} from '../about-page/about-page';
import {ContactPage} from '../contact-page/contact-page';
import {NavController} from 'ionic-angular';
import {UserService} from '../../services/user-services';
import {TabsPage} from '../tabs/tabs';

@Component({
  templateUrl: 'build/pages/personal-page/personal-page.html',
  providers: [UserService]
})

export class PersonalPage {

  private tab1Root: any;
  private tab2Root: any;
  private tab3Root: any;

  constructor(private nav: NavController, private us: UserService) {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.tab1Root = HomePage;
    this.tab2Root = AboutPage;
    this.tab3Root = ContactPage;
  }

  logout(){
    this.us.logout();
    this.nav.setRoot(TabsPage);
  }
}
