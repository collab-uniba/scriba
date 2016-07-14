import { Component } from '@angular/core';
import {ViewController, NavController, Modal, NavParams} from 'ionic-angular';
import {User} from '../../services/models/user-model';
import {TranscriptionService} from '../../services/recognition-service';

@Component({
  templateUrl: 'build/pages/intervent-page/intervent-page.html',
  providers:[TranscriptionService]
})
export class InterventPage {
    private intervent;
    constructor(private np: NavParams, private viewCtrl: ViewController, private nav: NavController, private ts: TranscriptionService) {
        this.intervent=this.np.get('intervent');
        this.intervent.text="";
    }

    startRecognizing(){
        this.ts.startDictation(this.intervent.text);
    }

    close() {
        this.nav.pop();
    }
}
