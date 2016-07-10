import { Http, Response, Headers,RequestOptions  } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import {Injectable, Inject} from '@angular/core';
import {Event} from './event-model';


@Injectable() 
export class EventService {
    private ServerWithApiUrl = "http://localhost:8080/api";
    static get parameters() {
        return [[Http]];
    }
    
    constructor(private http: Http, private eventData: Event) {

    }
    
    getPublicEvents(): Observable<Response> {
        let headers = new Headers({ 'Content-Type': ['application/x-www-form-urlencoded'] });//application/json
        let options = new RequestOptions({ headers: headers });
        let events = [];
        let result = this.http.get(this.ServerWithApiUrl + '/publicevents', options);   
        return result;
    }
    createEvent(event): Observable<Response>{
        console.log(event);
        let headers = new Headers({ 'Content-Type': ['application/x-www-form-urlencoded'] });//application/json
        let body = "title="+ event.title + "&date="+  event.date + "&hour=" + event.hour + "&location=" + event.location + "&organizer=" + event.organizer + "&sessions=" + event.sessions;
        console.log(body);
        headers.append("Authorization",window.localStorage.getItem("token"));
        let options = new RequestOptions({ headers: headers });
        let result = this.http.post(this.ServerWithApiUrl + '/createevent', body, options);   
        result.map(res=>res.json()).subscribe(data=>{
            console.log(data);
        })
        return result;
    }

}