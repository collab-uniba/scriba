import {Component} from '@angular/core';
import {NavController, Modal} from 'ionic-angular';
import {EventService} from '../../services/event-services';
import {Events} from 'ionic-angular';

//IMPORT PAGES - MODALS
import {NewEventPage} from '../modals/event-modal';

@Component({
  templateUrl: 'build/pages/personal-events-page/personal-events-page.html',
  providers: [EventService]
})
export class PersonalEventsPage {
	
  private events=[];

  constructor(private evts: Events, private nav: NavController, private es: EventService) {
    
  }
  
  ionViewWillEnter(){
	  this.updateEvents();
  }

  updateEvents(){//CAMBIARE IN GET PERSONAL EVENTS
    let _events = [];

    this.es.getPersonalEvents().map(res=> res.json()).subscribe((data) => {
      data.data.forEach(event =>{
        event.expanded=false;
        
        //FINDS AND MERGES SESSIONS
        let _sessions = [];
        this.es.getSessions(event._id).map(res=>res.json()).subscribe(data=>{
          data.data.forEach(session =>{
            session.expanded=false;
            //FINDS AND MERGES INTERVENTS
            let _intervents = [];
            this.es.getSessions(event._id).map(res=>res.json()).subscribe(data=>{
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
  newEvent(){
    this.evts.subscribe('reloadPersonalPage',() => {
      this.updateEvents();
    });
    let modal = Modal.create(NewEventPage);
    this.nav.present(modal);
  }
}