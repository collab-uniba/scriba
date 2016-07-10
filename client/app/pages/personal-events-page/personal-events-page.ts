import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {EventService} from '../../services/event-services';

import{NewEventPage} from '../new-event-page/new-event-page';

@Component({
  templateUrl: 'build/pages/personal-events-page/personal-events-page.html',
  providers: [EventService]
})
export class PersonalEventsPage {
	
	private events: string[];
  constructor(private nav: NavController, private es: EventService) {
    
  }
  
  ionViewWillEnter(){
	  this.updateEvents();
  }

  updateEvents(){//CAMBIARE IN GET PERSONAL EVENTS
    let _events = [];

    let eventList = this.es.getPublicEvents().map(res=> res.json()).subscribe((data) => {
      data.data.forEach(event =>{
        event.expanded=false;
        _events.push(event);
        this.events = _events;
      })
    });
  }

  newEvent(){
    this.nav.push(NewEventPage);
  }
}
