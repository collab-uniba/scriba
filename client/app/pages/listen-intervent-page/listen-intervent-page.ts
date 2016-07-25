import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {User} from '../../services/models/user-model';
import {Intervent} from '../../services/models/intervent-model';

declare var io: any;

@Component({
  templateUrl: 'build/pages/listen-intervent-page/listen-intervent-page.html',
})
export class ListenInterventPage {
    //GETS CURRENT USER
    private localUser=JSON.parse(window.localStorage.getItem("user"));
    private user= new User(this.localUser.name, this.localUser.surname, this.localUser.username, this.localUser.password, this.localUser.email);    

    private intervent = this.np.get('intervent');


    private text:string;
    private room = null; 
    constructor(private np: NavParams, private nav: NavController) {
        this.text="";
        console.log(this.intervent);
        this.room = io.connect('http://localhost:'+this.intervent.port);//"http://collab.di.uniba.it/~iaffaldano:48922"
        this.room.emit('client_type', {text: "Listener"});
        
        this.room.on('previous_text', (data) => {
            //this.text += data.text;
            document.getElementById('text').innerHTML += data.text;
            console.log(this.text);
        })
        this.room.on('server_message', (data) => {
            //this.text += data.text;
            document.getElementById('text').innerHTML += data.text; //BRUTTISSIMO!!!
            console.log(this.text);
        });

        this.room.on('closing_room', (data) => {
            this.room=null;
            alert(data.text);
        });
    }

    close() {
        this.room.disconnect();
        this.nav.pop();
    }
}
