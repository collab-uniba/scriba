import { Component } from '@angular/core';
import {NgForm} from '@angular/forms';
import {NavController, NavParams, Modal, Alert} from 'ionic-angular';
import {EventService} from '../../services/event-services';
import {Events} from 'ionic-angular';

//IMPORT MODELS
import {User} from '../../services/models/user-model';

//IMPORT PAGES - MODALS
import {NewSessionPage} from '../modals/session/session-modal';
import {SessionPage} from '../session-page/session-page';

@Component({
  templateUrl: 'build/pages/event-page/event-page.html',
  providers: [EventService]
})
export class EventPage {
  //GETS CURRENT USER
  private localUser=JSON.parse(window.localStorage.getItem("user"));
  private user= new User(this.localUser.name, this.localUser.surname, this.localUser.username, this.localUser.password, this.localUser.email);    

  private updating = false;
  private event=this.np.get('event');
  private newData;
  
  private today = new Date();
  private now = this.today.toISOString();

  //SETS EVENT SESSIONS
  private sessions = [];

  constructor(private nav: NavController, private np: NavParams, private es: EventService, private evts: Events) {
    this.newData={_id: this.event._id, title:this.event.title, startDate: this.event.startDate, endDate: this.event.endDate, location: this.event.location};
  }

  ionViewWillEnter(){
	  this.updateSessions(this.event._id);
  }

  updateSessions(eventID){//CAMBIARE IN GET PERSONAL EVENTS
    let _sessions = [];

    this.es.getSessions(eventID).map(res=> res.json()).subscribe((data) => {
      data.data.forEach(session =>{
            session.expanded=false;
            
            //FINDS AND MERGES INTERVENTS
            let _intervents = [];
            this.es.getIntervents(session._id).map(res=>res.json()).subscribe(data=>{
              data.data.forEach(intervent =>{
                _intervents.push(intervent);
              session.intervents=_intervents;
              })
            });
            _sessions.push(session);
          })
          this.sessions=_sessions;
      });
  }
  submit(){
    if(this.newData.startDate==null){
      this.newData.startDate=this.event.startDate;
    }
    if(this.newData.endDate==null){
      this.newData.endDate=this.event.endDate;
    }
    this.es.updateEvent(this.newData).map(res=>res.json()).subscribe(data=>{
      if(data.success){
        this.nav.pop()
      }else{
        alert(data.msg)
      }
    })
  }
  reset(){
    this.newData={_id: this.event._id, title:this.event.title, startDate: this.event.startDate, endDate: this.event.endDate, location: this.event.location};
    this.updating=false;
  }

  newSession(){
    this.evts.subscribe('reloadEventPage',() => {
      this.updateSessions(this.event._id);
    });
    let modal = Modal.create(NewSessionPage, {event: this.event, sessions: this.sessions});
    this.nav.present(modal);
  }

  openSession(sessionToOpen){
    this.nav.push(SessionPage,{
        event: this.event,
        session: sessionToOpen,
        sessions: this.sessions
    });
  }

  deleteSession(session){
    if(session.status=="ongoing"){
      alert("Impossibile eliminare la sessione poichè è ancora IN CORSO!")
    }else{
      let confirm = Alert.create({
        title: 'Cancellare questa Sessione?',
        message: 'Se cancelli questa sessione saranno eliminati tutti gli interventi al suo interno e non sarà più possibile ripristinarla!',
        buttons: [
          {
            text: 'Cancella',
            handler: () => {
              this.es.deleteSession(session._id).map(res=>res.json()).subscribe(data=>{
                if (data.success) {
                  this.updateSessions(this.event._id);
                }else{
                  alert(data.msg)
                }
              });
            }
          },
          {
            text: 'Mantieni'
          }
        ]
      });
      this.nav.present(confirm);
    }
  }
  formatDate(date: string): string{
    let formattedDate = "";
    let dateObject = new Date(date);

    let day=dateObject.getDate();
    let month=dateObject.getMonth() + 1;
    let year=dateObject.getFullYear();
    let hours=dateObject.getUTCHours();
    let minutes=dateObject.getUTCMinutes();
    if(hours<10){
      formattedDate = day + "/" + month + "/" + year + " ORE: 0" + hours;
    }else{
      formattedDate = day + "/" + month + "/" + year + " ORE: " + hours;
    }
    if(minutes<10){
      formattedDate += ".0" + minutes;
    }else{
      formattedDate += "." + minutes;
    }
    return formattedDate;
  }
  close() {
      this.nav.pop();
  }
}