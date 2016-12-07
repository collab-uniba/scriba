import {Component} from '@angular/core'
import {PersonalHomePage} from '../personal-home-page/personal-home-page';
import {AboutPage} from '../about-page/about-page';
import {ContactPage} from '../contact-page/contact-page';
import {Modal, NavController, MenuController, Events} from 'ionic-angular';
import {UserService} from '../../services/user-services';
import {User} from '../../services/models/user-model';
import {TabsPage} from '../tabs/tabs';
import {UserDataPage} from '../modals/user-update/userData-modal';
import {LoginPage} from '../modals/login/login-modal';
import {PersonalEventsPage} from '../personal-events-page/personal-events-page';
import {ObservedEventsPage} from '../observed-events-page/observed-events-page';
import {JoinedEventsPage} from '../joined-events-page/joined-events-page';

@Component({
  templateUrl: 'build/pages/personal-page/personal-page.html',
  providers: [UserService]
})

export class PersonalPage {
  private mobile=window.localStorage.getItem("platform");
  private user = new User("","","","","");;
  
  private PersonalEventsPage = PersonalEventsPage;
  private EventsPage = PersonalHomePage;
  private ObservedEventsPage = ObservedEventsPage;
  private JoinedEventsPage = JoinedEventsPage;
  private AboutPage = AboutPage;
  private ContactPage = ContactPage;
  private rootPage;

  constructor(private evts: Events, private nav: NavController, private us: UserService,  private menu: MenuController) {
    this.getUserData();
  }
  getUserData(){
    console.log("arrivo");
    this.us.getUserData().map(res => res.json()).subscribe( data => {
      if(data.success){
        this.user = new User(data.data.name, data.data.surname, data.data.username, data.data.password, data.data.email, data.data.observedEvents);
        window.localStorage.setItem("user", JSON.stringify(this.user));
        console.log(this.user.name);
        this.openPage(this.EventsPage);
      }else{
        this.nav.setRoot(TabsPage);
        let modal = Modal.create(LoginPage);
        this.nav.present(modal);
      }
    })
  }
  userData(){
    this.evts.subscribe('reloadUserData',() => {
      this.getUserData();
    });
    let modal = Modal.create(UserDataPage, {user: this.user});
    this.nav.present(modal);
  }

  logout(){
    this.us.logout();
    this.nav.setRoot(TabsPage);
  }

  openPage(page) {
    // Reset the nav controller to have just this page
    // we wouldn't want the back button to show in this scenario
    this.rootPage = page;
    
    // close the menu when clicking a link from the menu
    this.menu.close();
  }
}
