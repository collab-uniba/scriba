import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {EventService} from '../../../services/event-services';
import {NgForm} from '@angular/forms';

//IMPORT MODELS
import {User} from '../../../services/models/user-model';
import {Intervent} from '../../../services/models/intervent-model';

@Component({
  templateUrl: 'build/pages/modals/intervent/intervent-modal.html',
  providers: [EventService]
})
export class NewInterventPage {
    //GETS CURRENT USER
    private localUser=JSON.parse(window.localStorage.getItem("user"));
    private user= new User(this.localUser.name, this.localUser.surname, this.localUser.username, this.localUser.password, this.localUser.email);    
    

    private session=this.np.get('session');
    private intervent: Intervent;
    private time;
    private overlapError = {status: false, intervent: null};

    constructor(private nav: NavController, private np: NavParams, private es: EventService) {
        this.intervent = new Intervent("","",null,null,"", this.session._id, "programmed");
    }
    end(intervent): Date{
        let end = new Date(intervent.date);
        console.log(end);
        let hours = intervent.duration/60;
        let minutes = intervent.duration%60;
        end.setHours(end.getHours()+hours);
        end.setMinutes(end.getMinutes()+minutes);
        console.log(end);
        return end;
    }
    overlap(): Intervent{
        let overlap = null;
        let intervents=this.np.get('intervents');
        let interventStart =""+ this.intervent.date+":00.000Z";
        let interventEnd = this.end(this.intervent).toISOString();
        intervents.forEach(interventInList => {
            let inListStart = new Date(interventInList.date).toISOString();
            let inListEnd = this.end(interventInList).toISOString();

            if((inListStart < interventStart && interventStart < inListEnd) || 
                (inListStart < interventEnd && interventEnd < inListEnd) ||
                (interventStart < inListStart && inListEnd < interventEnd)){
                    console.log(interventInList);
                    overlap = interventInList;
            }
        });
        return overlap;
    }

    submit(){
        console.log(this.intervent);
        this.overlapError.status = false;
        this.overlapError.intervent = null;
        let olp = this.overlap();
        if(olp!=null){
            this.overlapError.status=true;
            this.overlapError.intervent=olp;
            console.log(this.overlapError);
        }else{
            this.es.createIntervent(this.intervent).map(res=>res.json()).subscribe(data=>{
                console.log(data);
                if(data.success){
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


