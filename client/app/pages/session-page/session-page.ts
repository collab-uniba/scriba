import { Component } from '@angular/core';
import {NgForm} from '@angular/forms';
import {NavController, NavParams, Modal} from 'ionic-angular';
import {EventService} from '../../services/event-services';
import {Events} from 'ionic-angular';

//IMPORT MODELS
import {User} from '../../services/models/user-model';

//IMPORT PAGES - MODALS
import {NewInterventPage} from '../modals/intervent/intervent-modal';
import {InterventPage} from '../intervent-page/intervent-page';

@Component({
  templateUrl: 'build/pages/session-page/session-page.html',
  providers: [EventService]
})
export class SessionPage {
  //GETS CURRENT USER
  private localUser=JSON.parse(window.localStorage.getItem("user"));
  private user= new User(this.localUser.name, this.localUser.surname, this.localUser.username, this.localUser.password, this.localUser.email);    

  //SETS PASSED EVENT
  private updating = false;
  private session;
  private newData;

  //SETS SESSION INTERVENTS
  private intervents = [];

  constructor(private nav: NavController, private np: NavParams, private es: EventService, private evts: Events) {
    this.session=this.np.get('session');
    this.newData={title:this.session.title, date: this.session.date};
  }

  ionViewWillEnter(){
	  this.updateIntervents(this.session._id);
  }

  updateIntervents(sessionID){//CAMBIARE IN GET PERSONAL EVENTS
    let _intervents = [];

    this.es.getIntervents(sessionID).map(res=> res.json()).subscribe((data) => {
      console.log(data);
      data.data.forEach(intervent =>{
            intervent.expanded=false;
            _intervents.push(intervent);
            this.intervents=_intervents;
          })
      });
  }
  submit(){
    console.log("SUBMIT");
    this.newData._id=this.session._id;
    this.es.updateSession(this.newData).map(res=>res.json()).subscribe(data=>{
      console.log(data);
      if(data.success){
        this.nav.pop()
      }else{
        alert(data.msg)
      }
    })
  }
  reset(){
    this.newData={title:this.session.title, date: this.session.date};
    this.updating=false;
  }

  newIntervent(){
    this.evts.subscribe('reloadSessionPage',() => {
      console.log("Update Intervents and remove intervent fetch from event page");
      this.updateIntervents(this.session._id);
    });
    let modal = Modal.create(NewInterventPage, {sessionID: this.session._id});
    this.nav.present(modal);
  }
  openIntervent(interventToOpen){
      //SOLO SE è TRA GLI SPEAKER
      this.nav.push(InterventPage, {
          intervent: interventToOpen
        })
  }

  close() {
      this.nav.pop();
  }
}