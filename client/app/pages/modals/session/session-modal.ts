import { Component } from '@angular/core';
import {NavController, NavParams, Alert} from 'ionic-angular';
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
            /*
            let confirm = Alert.create({
                title: 'La Sessione è contemporanea ad altre Sessioni, salvare comunque?',
                message: 'La Sessione si sovrappone con: "'+this.overlapError.session.title
                +'" prevista dal '+this.overlapError.session.startDate
                +' al '+this.overlapError.session.endDate,
                buttons: [
                    {
                    text: 'Salva',
                    handler: () => this.saveSession()
                    },
                    {
                    text: 'Modifica'
                    }
                ]
            });
            this.nav.present(confirm);
            */
        }else{
            this.saveSession();
        }
    }
    saveSession(){
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
    reset(){
        this.overlapError.status = false;
        this.overlapError.session = null;
        console.log(this.overlapError);
        this.overlap();
    }
    formatDate(date: string): string{
        let formattedDate = "";
        let dateObject = new Date(date);

        let day=dateObject.getDate();
        let month=dateObject.getMonth() + 1;
        let year=dateObject.getFullYear();
        let hours=dateObject.getUTCHours();
        let minutes=dateObject.getUTCMinutes();
        if(hours<10){
        formattedDate = day + "/" + month + "/" + year + " ORE: 0" + hours;
        }else{
        formattedDate = day + "/" + month + "/" + year + " ORE: " + hours;
        }
        if(minutes<10){
        formattedDate += ".0" + minutes;
        }else{
        formattedDate += "." + minutes;
        }
        return formattedDate;
    }
    trunc(date: String): string{
        return date.substring(0,15);
    }
    close() {
        this.nav.pop();//this.viewCtrl.destroy();//dismiss();
    }
}

