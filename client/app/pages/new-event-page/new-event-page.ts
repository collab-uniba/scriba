import { Component } from '@angular/core';
import {FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators, AbstractControl } from '@angular/common';
import {NgForm} from '@angular/forms';
import {ViewController, NavController, Modal} from 'ionic-angular';
import {UserService} from '../../services/user-services';
import {EventService} from '../../services/event-services';
import {User} from '../../services/user-model';

@Component({
  templateUrl: 'build/pages/new-event-page/new-event-page.html',
  directives: [FORM_DIRECTIVES],
  providers: [UserService, EventService]
})
export class NewEventPage {
  private localUser=JSON.parse(window.localStorage.getItem("user"));
  private user= new User(this.localUser.name, this.localUser.surname, this.localUser.username, this.localUser.password, this.localUser.email);
  private currentDate=new Date();
  event = {organizer:this.user.username, title:"", date: null, hour: null, location: "", sessions:[]};
  session = {title:"", date: null, hour: null, intervents:[]};
  intervent = {title:"", date: null, hour: null, speaker:""};

  constructor(private viewCtrl: ViewController, private nav: NavController, private us: UserService, private es: EventService) {

  }

  submit(){
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
    console.log(this.event);
    this.es.createEvent(this.event);
  }

  /*addSession(){
    this.event.sessions.push({title:"", date: null, hour: null, intervents:[]});
  }*/
  submitSession(){
    this.event.sessions.push(this.session);
    this.session = {title:"", date: null, hour: null, intervents:[]};
  }
  submitIntervent(){
    this.session.intervents.push(this.intervent);
    this.intervent ={title:"", date: null, hour: null, speaker:""};
  }
  onSubmit(value: string): void { 

    
  }

  showFormControls(form: NgForm) {
    console.log(this.event) // Dr. IQ
  }

  close() {
      
  }
}


