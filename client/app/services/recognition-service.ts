import {Injectable, Inject} from '@angular/core';

declare var webkitSpeechRecognition: any;

@Injectable()
export class TranscriptionService{
  private recognition;
  public final_transcript = "";
  private recognizing = false;
  constructor(){
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = true;
	    this.recognition.interimResults = true;
      this.recognition.onresult=this.resultHandler.bind(this);
			this.recognition.onstart=this.startHandler.bind(this);
			this.recognition.onerror=this.errorHandler.bind(this);
			this.recognition.onend=this.endHandler.bind(this);
    }else{
      console.log("Not CHROME");
    }
  }

  startDictation(transcription) {
    if (this.recognizing) {
      this.recognition.stop();
      this.recognizing=false;
      return;
    }
    this.final_transcript = transcription;

    this.recognition.lang = 'it-IT';
    this.recognition.start();
  }

  resultHandler(event){
		var interim_transcript = '';
		for (var i = event.resultIndex; i < event.results.length; ++i) {
			if (event.results[i].isFinal) {
				this.final_transcript += event.results[i][0].transcript;
				
        console.log(this.final_transcript);
			} else {
				interim_transcript += event.results[i][0].transcript;
			}
		}
		this.final_transcript = this.capitalize(this.final_transcript);
		//final_span.innerHTML = linebreak(final_transcript);
		//interim_span.innerHTML = linebreak(interim_transcript);
	};
	startHandler () {
		this.recognizing = true;
		console.log("RECOGNITION STARTED");
	};

	errorHandler(event) {
		console.log("RECOGNITION ERROR: " + event.error);
	};

	endHandler() {
		console.log("RECOGNITION STOPPED");
		if(this.recognizing){
			this.recognition.start();
			console.log("RECOGNITION RESTARTED");
		}
	};

  private two_line = /\n\n/g;
  private one_line = /\n/g;

	linebreak(s) {
		return s.replace(this.two_line, '<p></p>').replace(this.one_line, '<br>');
	}

	capitalize(s) {
		return s.replace(s.substr(0, 1), function (m) {
			return m.toUpperCase();
		});
	}
}