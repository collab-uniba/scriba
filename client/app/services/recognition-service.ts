import {Injectable, Inject} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import {Events} from 'ionic-angular';

declare var webkitSpeechRecognition: any;

@Injectable()
export class TranscriptionService{
  private recognition;
  public final_transcript = "";
  public recognizing = false;
	public delay = null;
	public transcriptionChange$: Observable<string>;
  private transcriptionObserver: Observer<string>;

  constructor(private evts: Events){
		this.transcriptionChange$ = new Observable<string>(observer => this.transcriptionObserver = observer).share(); // share() allows multiple subscribers
		
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = true;
	    this.recognition.interimResults = true;
      this.recognition.onresult=this.resultHandler.bind(this);
			this.recognition.onstart=this.startHandler.bind(this);
			this.recognition.onerror=this.errorHandler.bind(this);
			this.recognition.onend=this.endHandler.bind(this);
    }else{
			alert("Attenzione, Il servizio è disponibile solo su browser Google Chrome");
    }
  }

  startDictation() {
    this.final_transcript = "";
    this.recognition.lang = 'it-IT';
    this.recognition.start();
		this.recognizing=true;
  }
	stopDictation(){
		this.recognition.stop();
    this.recognizing=false;
		this.transcriptionObserver.complete();
	}

	resetTimeOut(){		
		clearTimeout(this.delay);
		this.delay = setTimeout(() => {
			this.recognition.stop();
  	}, 3000);
	}

  resultHandler(event){
		this.resetTimeOut();
		
		var interim_transcript = '';
		for (var i = event.resultIndex; i < event.results.length; ++i) {
			if (event.results[i].isFinal) {
				this.final_transcript += event.results[i][0].transcript;
				this.transcriptionObserver.next(event.results[i][0].transcript);
				//this.evts.publish('newResult', event.results[i][0].transcript);
			} else {
				interim_transcript += event.results[i][0].transcript;
			}
		}
		//final_span.innerHTML = linebreak(final_transcript);
		//interim_span.innerHTML = linebreak(interim_transcript);
	};
	startHandler () {
		this.recognizing = true;
		this.evts.publish('recognizing', this.recognizing);
		console.log(new Date() + "RECOGNITION STARTED");
	};

	errorHandler(event) {
		console.log(new Date() + "RECOGNITION ERROR: " + event.error);
	};

	endHandler() {
		console.log(new Date() +"RECOGNITION STOPPED");
		if(this.recognizing){
			this.recognition.start();
			console.log(new Date() +"RECOGNITION RESTARTED");
		}
	};

/*Rende la prima lettera della stringa Maiuscola
	capitalize(s) {
		return s.replace(s.substr(0, 1), function (m) {
			return m.toUpperCase();
		});
	}
*/
}