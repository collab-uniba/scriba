import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {ScientificFactsPage} from '../scientific-facts-page/scientific-facts-page';
import {EventService} from '../../services/event-services';

@Component({
  templateUrl: 'build/pages/home-page/home-page.html',
  providers: [EventService]
})
export class HomePage {
	
	private events: string[];
  constructor(private _navController: NavController, private es: EventService) {

  }
  
  ionViewWillEnter(){
	  this.updateEvents();
  }

  updateEvents(){
    let _events = [];

    let eventList = this.es.getPublicEvents().map(res=> res.json()).subscribe((data) => {
      data.data.forEach(event =>{
        console.log(event);
        event.expanded=false;
        _events.push(event);
      })
    });
    this.events = _events;
  }
  getSessions(event): string[]{
    let sessions=[];
    event.sessions.forEach(session => {
      session.expanded=false;
      sessions.push(session);
    });
    return sessions;
  }
  switch(session){
    session.expanded=!session.expanded;
    console.log(session);
  }
  print(event){
    console.log(event);
  }
  //selectFact(fact){
    //this._navController.push(SelectedFactPage, {selectedFact: fact})
  //}

  goToFactsPage(){
    this._navController.push(ScientificFactsPage);
  }
}
