import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {EventService} from '../../../services/event-services';
import {NgForm} from '@angular/forms';
import {Events} from 'ionic-angular';

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
    
    //SETS NEW VOID EVENT
    private intervent: Intervent;

    constructor(private evts: Events, private nav: NavController, private np: NavParams, private es: EventService) {
        this.intervent = new Intervent("","",null,"", this.np.get('sessionID'));
    }

    submit(){
        console.log(this.intervent);
        this.es.createIntervent(this.intervent).map(res=>res.json()).subscribe(data=>{
            console.log(data);
            if(data.success){
                this.evts.publish('reloadSessionPage');
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


