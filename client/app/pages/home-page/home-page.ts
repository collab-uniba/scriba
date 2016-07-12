import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {EventService} from '../../services/event-services';

@Component({
  templateUrl: 'build/pages/home-page/home-page.html',
  providers: [EventService]
})
export class HomePage {
	
	private events = [];
  private sessions: string[];
  constructor(private _navController: NavController, private es: EventService) {
    
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
}
