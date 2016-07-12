import { Component } from '@angular/core';
import {FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators, AbstractControl } from '@angular/common';
import {NgForm} from '@angular/forms';
import {ViewController, NavController, Modal} from 'ionic-angular';
import {UserService} from '../../services/user-services';
import {EventService} from '../../services/event-services';
import {User} from '../../services/models/user-model';
import {Event} from '../../services/models/event-model';
import {Session} from '../../services/models/session-model';
import {Intervent} from '../../services/models/intervent-model';

@Component({
  templateUrl: 'build/pages/new-event-page/new-event-page.html',
  directives: [FORM_DIRECTIVES],
  providers: [UserService, EventService]
})
export class NewEventPageOLD {
  //GETS CURRENT USER
  private localUser=JSON.parse(window.localStorage.getItem("user"));
  private user= new User(this.localUser.name, this.localUser.surname, this.localUser.username, this.localUser.password, this.localUser.email);    

  //SETS NEW VOID EVENT
  private creatingEvent=false;
  private events=[];
  private event = new Event("",this.user.username,"", null, "");
  
  
  session = {title:"", date: null, hour: null, intervents:[]};
  intervent = {title:"", date: null, hour: null, speaker:""};

  constructor(private viewCtrl: ViewController, private nav: NavController, private us: UserService, private es: EventService) {

  }

  submit(){
    let newEvent = this.event;
    this.es.createEvent(newEvent).map(res=>res.json()).subscribe(data=>{
      newEvent.id=data.id;
      this.events.push(newEvent);
    });
    this.event = new Event("",this.user.username,"", null, "");
    this.creatingEvent=!this.creatingEvent;
  }
  
  close() {
      this.nav.pop();
  }
}

/*
  createSingleSession(event){
    let singleSession = new Session("", event.title, event.date, [event.organizer], event.id);
    this.es.createSession(singleSession).map(res=>res.json()).subscribe(data=>{
      singleSession.id=data.id;
      this.events.push(singleSession);
    });
  }
  createSingleIntervent(session){
    let singleIntervent = new Intervent("", session.title, session.date, session.organizer, session.id);
    this.es.createIntervent(singleIntervent).map(res=>res.json()).subscribe(data=>{
      singleIntervent.id=data.id;
      this.events.push(singleIntervent);
    });
  }
  */

/*
    console.log(this.currentDate.getDate());
    console.log(this.currentDate.getDay());
    console.log(this.currentDate.getFullYear());
    console.log(this.currentDate.getHours());
    console.log(this.currentDate.getMilliseconds());
    console.log(this.currentDate.getMinutes());
    console.log(this.currentDate.getMonth());
    console.log(this.currentDate.getSeconds());
    console.log(this.currentDate.getTime());
    console.log(this.currentDate.getTimezoneOffset());
    console.log(this.currentDate.getUTCDate());
    console.log(this.currentDate.getUTCDay());
    console.log(this.currentDate.getUTCFullYear());
    console.log(this.currentDate.getUTCHours());
    console.log(this.currentDate.getUTCMilliseconds());
    console.log(this.currentDate.getUTCMinutes());
    console.log(this.currentDate.getUTCMonth());
    console.log(this.currentDate.getUTCSeconds());
    console.log(this.currentDate.toDateString());
    console.log(this.currentDate.toLocaleDateString());
    console.log(this.currentDate.toLocaleString());
    console.log(this.currentDate.toLocaleTimeString());
    console.log(this.currentDate.toString());
    console.log(this.currentDate.toTimeString());
    console.log(this.currentDate.toTimeString());
*/