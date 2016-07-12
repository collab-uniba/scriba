import { Component } from '@angular/core';
import {ViewController, NavController, Modal} from 'ionic-angular';
import {User} from '../../services/models/user-model';
import {TranscriptionService} from '../../services/recognition-service';

@Component({
  templateUrl: 'build/pages/intervent-page/intervent-page.html',
  providers:[TranscriptionService]
})
export class InterventPage {
    private transcription: string;
    constructor(private viewCtrl: ViewController, private nav: NavController, private ts: TranscriptionService) {
        this.transcription="";
    }

    startRecognizing(){
        this.ts.startDictation();
    }

    close() {
        
    }
}
