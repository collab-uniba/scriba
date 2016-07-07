import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {ScientificFactsPage} from '../scientific-facts-page/scientific-facts-page';
import {EventService} from '../../services/event-services';

import{RecognitionService} from '../../services/recognition-service';

@Component({
  templateUrl: 'build/pages/home-page/home-page.html',
  providers: [EventService, RecognitionService]
})
export class HomePage {
	
	private events: string[];
  constructor(private _navController: NavController, private es: EventService, private rs: RecognitionService) {
    
  }
  
  ionViewWillEnter(){
	  this.updateEvents();
  }

  updateEvents(){
    let _events = [];

    let eventList = this.es.getPublicEvents().map(res=> res.json()).subscribe((data) => {
      data.data.forEach(event =>{
        event.expanded=false;
        _events.push(event);
        this.events = _events;
      })
    });
    
  }

  //selectFact(fact){
    //this._navController.push(SelectedFactPage, {selectedFact: fact})
  //}

  goToFactsPage(){
    this._navController.push(ScientificFactsPage);
  }

  startRec(){
    this.rs.record('it-IT').subscribe(word => {
      console.log(word);
    })
  }

}
