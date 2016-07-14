import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {EventService} from '../../../services/event-services';
import {NgForm} from '@angular/forms';
import {Events} from 'ionic-angular';

//IMPORT MODELS
import {User} from '../../../services/models/user-model';
import {Session} from '../../../services/models/session-model';

@Component({
  templateUrl: 'build/pages/modals/session/session-modal.html',
  providers: [EventService]
})
export class NewSessionPage {
    //GETS CURRENT USER
    private localUser=JSON.parse(window.localStorage.getItem("user"));
    private user= new User(this.localUser.name, this.localUser.surname, this.localUser.username, this.localUser.password, this.localUser.email);    
    
    //SETS NEW VOID EVENT
    private session: Session;

    constructor(private evts: Events, private nav: NavController, private np: NavParams, private es: EventService) {
        this.session = new Session("","",null,[this.user.username], this.np.get('eventID'));
    }

    submit(){
        console.log(this.session);
        this.es.createSession(this.session).map(res=>res.json()).subscribe(data=>{
            console.log(data);
            if(data.success){
                this.evts.publish('reloadEventPage');
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

