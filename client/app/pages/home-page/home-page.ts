import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {EventService} from '../../services/event-services';
import {Events} from 'ionic-angular';
import {ListenInterventPage} from '../listen-intervent-page/listen-intervent-page';
declare var io: any;

@Component({
  templateUrl: 'build/pages/home-page/home-page.html',
  providers: [EventService]
})
export class HomePage {
	
	private events = [];

  constructor(private evts: Events, private nav: NavController, private es: EventService) {
    
  }
  
  ionViewWillEnter(){
	  this.updateEvents();
  }

  updateEvents(){
    let _events = [];

    this.es.getPublicEvents().map(res=> res.json()).subscribe((data) => {
      data.data.forEach(event =>{
        event.expanded=false;
        
        //FINDS AND MERGES SESSIONS
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
      });
    });
  }
  openEvent(eventToOpen){
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
    //AVVIA ASCOLTO 
    /*this.nav.push(EventPage,{
        event: eventToOpen,
    });
    */

  }
}


  
  