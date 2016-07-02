import {Component} from '@angular/core'
import {HomePage} from '../home-page/home-page';
import {AboutPage} from '../about-page/about-page';
import {ContactPage} from '../contact-page/contact-page';
import {Modal, NavController} from 'ionic-angular';
import {UserService} from '../../services/user-services';
import {User} from '../../services/user-model';
import {TabsPage} from '../tabs/tabs';
import {UserDataPage} from '../modals/userData-modal';
import{LoginPage} from '../modals/login-modal'

@Component({
  templateUrl: 'build/pages/personal-page/personal-page.html',
  providers: [UserService]
})

export class PersonalPage {
  private user: User;
  private tab1Root: any;
  private tab2Root: any;
  private tab3Root: any;

  constructor(private nav: NavController, private us: UserService) {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.user = new User("","","","","");
    this.tab1Root = HomePage;
    this.tab2Root = AboutPage;
    this.tab3Root = ContactPage;
  }
  ionViewWillEnter(){
	  this.getUserData();
  }
  getUserData(){
    this.us.getUserData().map(res => res.json()).subscribe( data => {
      if(data.success){
        this.user = new User(data.data.name, data.data.surname, data.data.username, data.data.password, data.data.email);
        window.localStorage.setItem("user", JSON.stringify(this.user));
      }else{
        this.nav.setRoot(TabsPage);
        let modal = Modal.create(LoginPage);
        this.nav.present(modal);
      }
    })
  }
  userData(){
    let modal = Modal.create(UserDataPage);
    this.nav.present(modal);
  }

  logout(){
    this.us.logout();
    this.nav.setRoot(TabsPage);
  }
}
