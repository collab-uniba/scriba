import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {EventService} from '../../../services/event-services';
import {NgForm} from '@angular/forms';
import {Events} from 'ionic-angular';

//IMPORT MODELS
import {User} from '../../../services/models/user-model';
import {Event} from '../../../services/models/event-model';

@Component({
  templateUrl: 'event-modal.html',
  providers: [EventService]
})
export class NewEventPage {
    //GETS CURRENT USER
    private localUser=JSON.parse(window.localStorage.getItem("user"));
    private user= new User(this.localUser.name, this.localUser.surname, this.localUser.username, this.localUser.password, this.localUser.email);    
    //SETS NEW VOID EVENT
    private today = new Date();
    private now = this.today.toISOString();

    private event = new Event("",this.user.username,"", this.today, this.today, "", "programmed");
    constructor(private np: NavParams, private evts: Events, private nav: NavController, private es: EventService) {
        console.log(this.now);
    }
    submit(){
        console.log(this.event);
        this.es.createEvent(this.event).map(res=>res.json()).subscribe(data=>{
            console.log(data);
            if(data.success){
                this.evts.publish('reloadPersonalPage');
                this.nav.pop();
            }else{
                alert(data.msg);
            }
        });
    }


    close() {
        this.nav.pop();//this.viewCtrl.destroy();//dismiss();
    }
}

