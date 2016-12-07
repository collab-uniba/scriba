import {Component} from '@angular/core';
import {NavController, Alert, Modal} from 'ionic-angular';
import {EventService} from '../../services/event-services';
import {UserService} from '../../services/user-services';
import {Events} from 'ionic-angular';
import {ListenInterventPage} from '../listen-intervent-page/listen-intervent-page';

import {LoginPage} from '../modals/login/login-modal';
import {SignupPage} from '../modals/signup/signup-modal';

declare var io: any;

@Component({
  templateUrl: 'build/pages/home-page/home-page.html',
  providers: [EventService, UserService]
})
export class HomePage {
  private mobile=window.localStorage.getItem("platform");
  private programmedEvents =[];
  private ongoingEvents = [];
  private passedEvents = [];
	//private events = [];
  private events = "programmed";
  private tu;
  constructor(private evts: Events, private nav: NavController, private es: EventService, private us: UserService) {
    this.updateEvents();
    console.log(this.programmedEvents.length);
    this.timingUpdate();
  }

  ionViewWillLeave(){
    clearTimeout(this.tu);
  }
  timingUpdate(){
    this.tu = setTimeout(()=>{
      console.log("aggiorno");
      this.updateEvents();
      this.timingUpdate();
    }, 15000);
  }

  updateEvents(){
    let _progEvents = [];
    let _ongEvents = [];
    let _passEvents = [];

    this.es.getPublicEvents().map(res=> res.json()).subscribe((data) => {
      data.data.forEach(event =>{
        event.expanded=false;
        if(event.status=="programmed"){
          //FINDS AND MERGES SESSIONS
          let _sessions = [];
          this.es.getSessions(event._id).map(res=>res.json()).subscribe((data)=>{
            data.data.forEach(session =>{
              session.expanded=false;
              //FINDS AND MERGES INTERVENTS
              let _intervents = [];
              this.es.getIntervents(session._id).map(res=>res.json()).subscribe((data)=>{
                data.data.forEach(intervent =>{
                  _intervents.push(intervent);
                  session.intervents=_intervents;
                })
              });
              _sessions.push(session);
              event.sessions=_sessions;
            })
          })
          _progEvents.push(event);
          
        }
        if(event.status=="ongoing"){
          //FINDS AND MERGES SESSIONS
          let _sessions = [];
          this.es.getSessions(event._id).map(res=>res.json()).subscribe((data)=>{
            data.data.forEach(session =>{
              session.expanded=false;
              //FINDS AND MERGES INTERVENTS
              let _intervents = [];
              this.es.getIntervents(session._id).map(res=>res.json()).subscribe((data)=>{
                data.data.forEach(intervent =>{
                  _intervents.push(intervent);
                  session.intervents=_intervents;
                })
              });
              _sessions.push(session);
              event.sessions=_sessions;
            })
          })
          _ongEvents.push(event);
          
        }
        if(event.status=="passed"){
          //FINDS AND MERGES SESSIONS
          let _sessions = [];
          this.es.getSessions(event._id).map(res=>res.json()).subscribe((data)=>{
            data.data.forEach(session =>{
              session.expanded=false;
              //FINDS AND MERGES INTERVENTS
              let _intervents = [];
              this.es.getIntervents(session._id).map(res=>res.json()).subscribe((data)=>{
                data.data.forEach(intervent =>{
                  _intervents.push(intervent);
                  session.intervents=_intervents;
                })
              });
              _sessions.push(session);
              event.sessions=_sessions;
            })
          })
          _passEvents.push(event);
          
        }
        this.programmedEvents = _progEvents;
        this.ongoingEvents = _ongEvents;
        this.passedEvents = _passEvents;
        /*//FINDS AND MERGES SESSIONS
        let _sessions = [];
        this.es.getSessions(event._id).map(res=>res.json()).subscribe(data=>{
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
            event.sessions=_sessions;
          })
        })
        _events.push(event);
        this.events = _events;
        */
      });
    });
  }
  openEvent(eventToOpen){
    let confirm = Alert.create({
            title: 'Accedi o Registrati per seguire questo Evento',
            message: 'Hai bisogno di un profilo per seguire questo evento!',
            buttons: [
            {
                text: 'Accedi',
                handler: () => {
                  this.evts.subscribe('openEvent', () => {
                    //METTE L'EVENTO TRA QUELLI A CUI HA PARTECIPATO
                    //IMPOSTA LA PAGINA ROOT A PERSONAL PAGE
                    //PUSHA LA PAGINA DI ASCOLTO DELL'EVENTO
                  });
                  let modal = Modal.create(LoginPage);
                  this.nav.present(modal);
                }
            },
            {
                text: 'Registrati',
                handler: () => {
                  //PRESENTA IL MODAL DI REGISTRAZIONE
                  //PRESENTA IL MODAL DI LOGIN
                  //METTE L'EVENTO TRA QUELLI A CUI HA PARTECIPATO
                  //IMPOSTA LA PAGINA ROOT A PERSONAL PAGE
                  //PUSHA LA PAGINA DI ASCOLTO DELL'EVENTO
                }
            },
            {
                text: 'Annulla'
            }
            ]
        });
        this.nav.present(confirm);
        /*
    this.events.forEach(event => {
      if(event._id==eventToOpen._id){
        console.log(event);
        event.sessions.forEach(session => {
          if(session.status=="ongoing"){
            console.log(session);
            session.intervents.forEach(intervent => {
              if(intervent.status=="ongoing"){
                console.log(intervent);
                this.nav.push(ListenInterventPage,{intervent: intervent})
              }
            });
          }
        });
      }
    });
    */
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
}


  
  