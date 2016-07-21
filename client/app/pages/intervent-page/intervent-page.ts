import { Component } from '@angular/core';
import {ViewController, NavController, Modal, NavParams, Events} from 'ionic-angular';
import {User} from '../../services/models/user-model';
import {Intervent} from '../../services/models/intervent-model';
import {EventService} from '../../services/event-services';
import {TranscriptionService} from '../../services/recognition-service';

declare var io: any;

@Component({
  templateUrl: 'build/pages/intervent-page/intervent-page.html',
  providers:[TranscriptionService, EventService]
})
export class InterventPage {
    //GETS CURRENT USER
    private localUser=JSON.parse(window.localStorage.getItem("user"));
    private user= new User(this.localUser.name, this.localUser.surname, this.localUser.username, this.localUser.password, this.localUser.email);    

    private session = this.np.get('session');
    private intervent = this.np.get('intervent');
    private intervents = this.np.get('intervents');
    private newData;
    private updating=false;
    private overlapError = {status: false, intervent: null};

    private text;
    private recognizing=this.ts.recognizing;
    private room = null; 
    constructor(private es: EventService, private evts: Events, private np: NavParams, private viewCtrl: ViewController, private nav: NavController, private ts: TranscriptionService) {
        this.text="";
        this.intervent.text="";
        console.log(this.intervent);
        this.newData = {_id: this.intervent._id, title:this.intervent.title, date: this.intervent.date, duration: this.intervent.duration, speaker: this.intervent.speaker};
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
        let interventStart =""+ this.newData.date+":00.000Z";
        let interventEnd = this.end(this.newData).toISOString();
        intervents.forEach(interventInList => {
            if(interventInList._id!=this.newData._id){
                let inListStart = new Date(interventInList.date).toISOString();
                let inListEnd = this.end(interventInList).toISOString();

                if((inListStart < interventStart && interventStart < inListEnd) || 
                    (inListStart < interventEnd && interventEnd < inListEnd) ||
                    (interventStart < inListStart && inListEnd < interventEnd)){
                        console.log(interventInList);
                        overlap = interventInList;
                }
            }
        });
        return overlap;
    }
    submit(){
        console.log(this.newData);
        this.overlapError.status = false;
        this.overlapError.intervent = null;
        let olp = this.overlap();
        if(olp!=null){
            this.overlapError.status=true;
            this.overlapError.intervent=olp;
            console.log(this.overlapError);
        }else{
            console.log("INVIATO");
            
            this.es.updateIntervent(this.newData).map(res=>res.json()).subscribe(data=>{
                console.log(data);
                if(data.success){
                    this.evts.publish('reloadSessionPage');
                    this.nav.pop();
                }else{
                    alert(data.msg);
                }
            });
        }
    }
    reset(){
        this.newData = {_id: this.intervent._id, title:this.intervent.title, date: this.intervent.date, duration: this.intervent.duration, speaker: this.intervent.speaker};
        this.updating = false;
    }


    openRoom(){
        this.es.openServer(this.intervent._id).map(res=>res.json()).subscribe(data=>{
            if(data.success){
                console.log(data.port);
                this.room = io.connect('http://localhost:'+data.port);//"http://collab.di.uniba.it/~iaffaldano:48922"
                this.room.emit('client_type', {text: "Speaker"});
            }else{
                alert(data.msg);
            }
            
        });
    }
    closeRoom(){
        this.room.emit('close_room');//CHIUDE IL SERVER
        this.room.disconnect();//DISCONNETTE IL SINGOLO CLIENT
        this.room=null;
    }
    saveAndCloseRoom(){
        console.log("save and close");
    }
    startRecognizing(){
        
        this.recognizing=!this.recognizing;
        this.ts.startDictation();
        /*
        this.evts.subscribe('newResult', (data) => {
            this.updateText();
        });
        */

        this.ts.transcriptionChange$.subscribe(data=>{
            console.log(data);
            this.room.emit('client_message', {text: data});
            //this.text+=data;
            document.getElementById('text').innerHTML += data; //BRUTTISSIMO!!!
        });
    }

    stopRecognizing(){
        this.recognizing=!this.recognizing;
        this.ts.stopDictation();
    }
    close() {
        this.nav.pop();
    }
}
