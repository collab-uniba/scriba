import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {User} from '../../services/models/user-model';
import {Intervent} from '../../services/models/intervent-model';
import {NgForm} from '@angular/forms';
import {Configuration} from '../../services/config';
import * as io from 'socket.io-client';

    
//declare var io: any;

@Component({
  templateUrl: 'listen-intervent-page.html',
})
export class ListenInterventPage {
    private config = new Configuration();
    private mobile=window.localStorage.getItem("platform");
    //GETS CURRENT USER
    private localUser=JSON.parse(window.localStorage.getItem("user"));
    private user= new User(this.localUser.name, this.localUser.surname, this.localUser.username, this.localUser.password, this.localUser.email);    

    private intervent = this.np.get('intervent');
    private questioning=false;
    private question:string;

    private transcription:string;
    private room = null; 
    constructor(private np: NavParams, private nav: NavController) {
        this.transcription="";
        console.log(this.intervent);
        this.room = io.connect(this.config.getRoomUrl()+':'+this.config.socketPORT);//"http://collab.di.uniba.it/~iaffaldano:48922"
        //this.room.emit('client_type', {text: "Listener"});
        this.room.emit('join_room', {type: "Listener", room: this.intervent._id});

        this.room.on('question', (data) => {
            console.log("QUESTION: " + data.text);
            this.intervent.questions.push(data);
        });
        /*
        this.room.on('user_connection', (data) => {
            console.log(data.text);
        })
        */

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
        
        this.room.on('new_transcription', (data) => {
            //this.text += data.text;
            console.log(new Date() + " " + data.text);
            //document.getElementById('text').innerHTML += data.text;
            this.transcription += " " +data.text;
            
        });

        this.room.on('disconnection', (data) => {
            this.room.emit('leave_room', {room: this.intervent._id});
            this.room=null;
            alert(data.text);
        });
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

    close() {
        if(this.room!=null){
            this.room.emit('leave_room', {room: this.intervent._id});
            this.room.disconnect();
            this.room=null;
        }
        this.nav.pop();
    }

    sendQuestion(){
        this.room.emit('client_question', {text: this.question, user: this.user.username, room: this.intervent._id});
        this.intervent.questions.push({text: this.question, user: this.user.username});
        console.log(this.question);
        this.question='';
        this.questioning=!this.questioning;
    }
}
