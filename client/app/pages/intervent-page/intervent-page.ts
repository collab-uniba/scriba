import { Component } from '@angular/core';
import {NavController, NavParams, Events, Alert} from 'ionic-angular';
import {User} from '../../services/models/user-model';
import {Intervent} from '../../services/models/intervent-model';
import {EventService} from '../../services/event-services';
import {TranscriptionService} from '../../services/recognition-service';
import {Configuration} from '../../services/config';

declare var io: any;

@Component({
  templateUrl: 'build/pages/intervent-page/intervent-page.html',
  providers:[TranscriptionService, EventService]
})
export class InterventPage {
    private config = new Configuration();
    private mobile=window.localStorage.getItem("platform");
    //GETS CURRENT USER
    private localUser=JSON.parse(window.localStorage.getItem("user"));
    private user= new User(this.localUser.name, this.localUser.surname, this.localUser.username, this.localUser.password, this.localUser.email);    

    private session = this.np.get('session');
    private intervent = this.np.get('intervent');
    private intervents = this.np.get('intervents');
    private newData;
    private updating=false;
    private overlapError = {status: false, intervent: null};
    private newQuestions=[];
    private transcription;
    private recognizing=this.ts.recognizing;
    private room = null;  
    constructor(private es: EventService, private evts: Events, private np: NavParams, private nav: NavController, private ts: TranscriptionService) {
        this.transcription="";
        //this.intervent.text="";
        this.newData = {_id: this.intervent._id, title:this.intervent.title, date: this.intervent.date, duration: this.intervent.duration, speaker: this.intervent.speaker};
    }  

    ionViewWillEnter(){
        if(this.intervent.status=="ongoing"){
            this.room = io.connect(this.config.getRoomUrl()+':'+this.config.socketPORT);
            this.room.emit('join_room', {type: "Speaker", room: this.intervent._id});
            this.room.on('previous_text', (data) => {
                //this.text += data.text;
                //document.getElementById('text').innerHTML += data.text;
                this.transcription += data.text;
                console.log(data.questions);
                if(data.questions.length!=0){
                    this.intervent.questions=this.intervent.questions.concat(data.questions);
                    console.log(this.intervent.questions);
                }
                console.log(this.transcription);
            })
        }
    }
    ionViewWillLeave(){
        this.stopRecognizing();
    }

    end(intervent): Date{
        let end = new Date(intervent.date);
        let hours = intervent.duration/60;
        let minutes = intervent.duration%60;
        end.setHours(end.getHours()+hours);
        end.setMinutes(end.getMinutes()+minutes);
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
        }else{
            if(this.newData.date==null){
                this.newData.date=this.intervent.date;
            }

            this.es.updateIntervent(this.newData).map(res=>res.json()).subscribe(data=>{
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
        this.room = io.connect(this.config.getRoomUrl()+':'+this.config.socketPORT);//"http://collab.di.uniba.it/~iaffaldano:48922"
        this.room.emit('client_type', {text: "Speaker"});

        this.es.openServer(this.intervent._id).map(res=>res.json()).subscribe(data=>{
            if(data.success){
                console.log(this.config.socketPORT);
                
                this.room.emit('open_room', {room: this.intervent._id});

                this.room.on('question', (data) => {
                    console.log("QUESTION: " + data.text);
                    this.intervent.questions.push(data);
                    this.newQuestions.push(data);
                    /*this.es.addQuestion(this.intervent, data.text).map(res=>res.json()).subscribe(data=>{
                        console.log(data);
                        if(data.success){
                            this.intervent=data.data;
                        }
                    });
                    */
                });
                
            }else{
                alert(data.msg);
            }
            
        });
    }
    closeRoom(){
        let confirm = Alert.create({
            title: 'Chiudere la Stanza?',
            message: 'Chiudendo la stanza in questo momento perderai tutto il testo trascritto. Si consiglia di Salvare il testo prima di chiudere questa Stanza!',
            buttons: [
            {
                text: 'Salva e Chiudi',
                handler: () => this.saveAndCloseRoom()
            },
            {
                text: 'Chiudi senza Salvare',
                handler: () => {
                    this.room.emit('close_room', {room: this.intervent._id});//CHIUDE IL SERVER
                    this.room.disconnect();//DISCONNETTE IL SINGOLO CLIENT
                    this.room=null;
                }
            },
            {
                text: 'Annulla'
            }
            ]
        });
        this.nav.present(confirm);
    }
    saveAndCloseRoom(){
        this.intervent.text=document.getElementById('text').innerHTML;
        this.es.saveInterventText(this.intervent).map(res=>res.json()).subscribe(data=>{
            if (data.success) {
                this.newQuestions.forEach(quest => {
                    this.es.addQuestion(this.intervent, quest).map(res=>res.json()).subscribe(data=>{
                        console.log(data);
                        if(data.success){
                            this.intervent=data.data;
                        }
                    });
                });
                this.room.emit('close_room', {room: this.intervent._id});//CHIUDE IL SERVER
                this.room.disconnect();//DISCONNETTE IL SINGOLO CLIENT
                this.room=null;
            }else{
                alert(data.msg)
            }
        });
    }
    startRecognizing(){
        
        this.recognizing=!this.recognizing;
        this.ts.startDictation();
        /*
        this.evts.subscribe('newResult', (data) => {
            this.updateText();
        });
        */
        let _transcription=this.transcription;
        this.ts.transcriptionChange$.subscribe(data=>{
            //console.log(new Date() + data);
            this.room.emit('speaker_message', {text: data, room: this.intervent._id});
            document.getElementById('text').innerHTML += " " + data; //BRUTTISSIMO!!!
        });
        
    }

    stopRecognizing(){
        this.recognizing=!this.recognizing;
        this.ts.stopDictation();
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
        this.nav.pop();
    }
}
