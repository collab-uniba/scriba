import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

export interface IRecognitionService extends Window{
    webkitSpeechRecognition: any;
}

@Injectable()
export class RecognitionService {

  constructor() {
    /* void */
  }

  /**
   * Record
   * @param {string} language - Language of the voice recognition
   * @returns {Observable<string>} - Observable of voice converted to string 
   */
  record(language: string): Observable<string> {
    return Observable.create((observer) => {
      const { webkitSpeechRecognition }: IRecognitionService = <IRecognitionService>window;
      const recognition = new webkitSpeechRecognition();
      recognition.onresult = (e) => observer.next(e.results.item(e.results.length - 1).item(0).transcript);
      recognition.onerror = observer.error;
      recognition.onend = observer.completed;

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;
      recognition.start();
    });
  }
}