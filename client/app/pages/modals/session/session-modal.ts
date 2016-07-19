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


    private today = new Date();
    private now = this.today.toISOString();

    //SETS NEW VOID SESSION
    private event = this.np.get('event');
    private session = new Session("", "", this.today, this.today, [this.user.username], "programmed", this.event._id);
    private overlapError = {status: false, session: null};

    constructor(private evts: Events, private nav: NavController, private np: NavParams, private es: EventService) {
        console.log(this.event);
    }

    overlap(): Session{
        let overlap = null;
        let sessions=this.np.get('sessions');
        sessions.forEach(sessionInList => {
            console.log(this.session.startDate);
            console.log(this.session.endDate);
            console.log(sessionInList.startDate);
            console.log(sessionInList.endDate);
            if((sessionInList.startDate < this.session.startDate && this.session.startDate < sessionInList.endDate) || 
                (sessionInList.startDate < this.session.endDate && this.session.endDate < sessionInList.endDate) ||
                (this.session.startDate < sessionInList.startDate && sessionInList.endDate < this.session.endDate)){
                console.log(sessionInList);
                overlap = sessionInList;
            }
        });
        return overlap;
    }

    submit(){
        this.overlapError.status = false;
        this.overlapError.session = null;
        console.log(this.overlapError);
        let olp = this.overlap();
        if(olp!=null){
            this.overlapError.status=true;
            this.overlapError.session=olp;
            console.log(this.overlapError);
        }else{
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
    }

    close() {
        this.nav.pop();//this.viewCtrl.destroy();//dismiss();
    }
}

