import { Http, Response, Headers,RequestOptions  } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import {Injectable, Inject} from '@angular/core';
import {Event} from './models/event-model';


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
    getSessions(eventID): Observable<Response> {
        let headers = new Headers({ 'Content-Type': ['application/x-www-form-urlencoded'] });//application/json
        let body = "event=" + eventID;
        let options = new RequestOptions({ headers: headers });
        let events = [];
        let result = this.http.post(this.ServerWithApiUrl + '/sessions',body, options);   
        return result;
    }
    getIntervents(sessionID): Observable<Response> {
        let headers = new Headers({ 'Content-Type': ['application/x-www-form-urlencoded'] });//application/json
        let body = "session=" + sessionID;
        let options = new RequestOptions({ headers: headers });
        let events = [];
        let result = this.http.post(this.ServerWithApiUrl + '/intervents',body, options);   
        return result;
    }
    getPersonalEvents(): Observable<Response> {
        let headers = new Headers({ 'Content-Type': ['application/x-www-form-urlencoded'] });//application/json
        headers.append("Authorization",window.localStorage.getItem("token"));
        let options = new RequestOptions({ headers: headers });
        let events = [];
        let result = this.http.get(this.ServerWithApiUrl + '/personalevents', options);   
        return result;
    }
    createEvent(event): Observable<Response>{
        console.log(event);
        let headers = new Headers({ 'Content-Type': ['application/x-www-form-urlencoded'] });//application/json
        let body = "title="+ event.title + "&date="+  event.date + "&location=" + event.location + "&organizer=" + event.organizer;
        headers.append("Authorization",window.localStorage.getItem("token"));
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.ServerWithApiUrl + '/createevent', body, options);
    }
     createSession(session): Observable<Response>{
        console.log(session);
        let headers = new Headers({ 'Content-Type': ['application/x-www-form-urlencoded'] });//application/json
        let body = "title="+ session.title + "&date="+  session.date + "&speakers=" + session.speakers +"&event=" + session.event;
        console.log(body);
        headers.append("Authorization",window.localStorage.getItem("token"));
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.ServerWithApiUrl + '/createsession', body, options);   
    }
     createIntervent(intervent): Observable<Response>{
        console.log(intervent);
        let headers = new Headers({ 'Content-Type': ['application/x-www-form-urlencoded'] });//application/json
        let body = "title="+ intervent.title + "&date="+  intervent.date + "&speaker=" + intervent.speaker + "&session=" + intervent.session;
        console.log(body);
        headers.append("Authorization",window.localStorage.getItem("token"));
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.ServerWithApiUrl + '/createintervent', body, options);   
    }
    updateEvent(event): Observable<Response>{
        console.log(event);
        let headers = new Headers({ 'Content-Type': ['application/x-www-form-urlencoded'] });//application/json
        let body = "id=" + event._id +"&title="+ event.title + "&date="+  event.date + "&location=" + event.location;
        console.log(body);
        headers.append("Authorization",window.localStorage.getItem("token"));
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.ServerWithApiUrl + '/updateevent', body, options);   
    }
    updateSession(session): Observable<Response>{
        console.log(session);
        let headers = new Headers({ 'Content-Type': ['application/x-www-form-urlencoded'] });//application/json
        let body = "id=" + session._id +"&title="+ session.title + "&date="+  session.date;
        console.log(body);
        headers.append("Authorization",window.localStorage.getItem("token"));
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.ServerWithApiUrl + '/updatesession', body, options);   
    }


}