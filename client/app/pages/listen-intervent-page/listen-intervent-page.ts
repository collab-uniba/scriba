import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {User} from '../../services/models/user-model';
import {Intervent} from '../../services/models/intervent-model';

declare var io: any;

@Component({
  templateUrl: 'build/pages/listen-intervent-page/listen-intervent-page.html',
})
export class ListenInterventPage {
    private mobile=window.localStorage.getItem("platform");
    //GETS CURRENT USER
    private localUser=JSON.parse(window.localStorage.getItem("user"));
    private user= new User(this.localUser.name, this.localUser.surname, this.localUser.username, this.localUser.password, this.localUser.email);    

    private intervent = this.np.get('intervent');


    private text:string;
    private room = null; 
    constructor(private np: NavParams, private nav: NavController) {
        this.text="";
        console.log(this.intervent);
        this.room = io.connect('http://192.168.0.44:'+this.intervent.port);//"http://collab.di.uniba.it/~iaffaldano:48922"
        this.room.emit('client_type', {text: "Listener"});
        
        this.room.on('previous_text', (data) => {
            //this.text += data.text;
            document.getElementById('text').innerHTML += data.text;
            console.log(this.text);
        })
        this.room.on('server_message', (data) => {
            //this.text += data.text;
            console.log(new Date() + " " + data.text);
            document.getElementById('text').innerHTML += data.text; //BRUTTISSIMO!!!
            
        });

        this.room.on('closing_room', (data) => {
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
        this.room.disconnect();
        this.nav.pop();
    }
}
