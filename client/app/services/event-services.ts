import { Http, Response, Headers,RequestOptions  } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import {Injectable, Inject} from '@angular/core';

@Injectable() 
export class EventService {
    private ServerWithApiUrl = "http://192.168.0.44:8080/api";//http://localhost:
    static get parameters() {
        return [[Http]];
    }
    
    constructor(private http: Http) {

    }
    
    getPublicEvents(): Observable<Response> {
        let headers = new Headers({ 'Content-Type': ['application/x-www-form-urlencoded'] });//application/json
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.ServerWithApiUrl + '/publicevents', options);   
    }
    getSessions(eventID): Observable<Response> {
        let headers = new Headers({ 'Content-Type': ['application/x-www-form-urlencoded'] });//application/json
        let body = "event=" + eventID;
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.ServerWithApiUrl + '/sessions',body, options);   
    }
    getIntervents(sessionID): Observable<Response> {
        let headers = new Headers({ 'Content-Type': ['application/x-www-form-urlencoded'] });//application/json
        let body = "session=" + sessionID;
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.ServerWithApiUrl + '/intervents',body, options);   
    }
    getPersonalEvents(): Observable<Response> {
        let headers = new Headers({ 'Content-Type': ['application/x-www-form-urlencoded'] });//application/json
        headers.append("Authorization",window.localStorage.getItem("token"));
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.ServerWithApiUrl + '/personalevents', options);   
    }
    getObservedEvents(): Observable<Response> {
        let headers = new Headers({ 'Content-Type': ['application/x-www-form-urlencoded'] });//application/json
        headers.append("Authorization",window.localStorage.getItem("token"));
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.ServerWithApiUrl + '/observedevents', options);   
    }
    getJoinedEvents(): Observable<Response> {
        let headers = new Headers({ 'Content-Type': ['application/x-www-form-urlencoded'] });//application/json
        headers.append("Authorization",window.localStorage.getItem("token"));
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.ServerWithApiUrl + '/joinedevents', options);   
    }
    createEvent(event): Observable<Response>{
        console.log(event);
        let headers = new Headers({ 'Content-Type': ['application/x-www-form-urlencoded'] });//application/json
        let body = "title="+ event.title + "&startDate="+  event.startDate + "&endDate="+  event.endDate + "&location=" + event.location + "&organizer=" + event.organizer + "&status=" + event.status;
        headers.append("Authorization",window.localStorage.getItem("token"));
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.ServerWithApiUrl + '/createevent', body, options);
    }
    createSession(session): Observable<Response>{
        console.log(session);
        let headers = new Headers({ 'Content-Type': ['application/x-www-form-urlencoded'] });//application/json
        let body = "title="+ session.title + "&startDate="+  session.startDate + "&endDate="+  session.endDate + "&speakers=" + session.speakers +"&status=" + session.status +"&event=" + session.event;
        console.log(body);
        headers.append("Authorization",window.localStorage.getItem("token"));
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.ServerWithApiUrl + '/createsession', body, options);   
    }
     createIntervent(intervent): Observable<Response>{
        console.log(intervent);
        let headers = new Headers({ 'Content-Type': ['application/x-www-form-urlencoded'] });//application/json
        let body = "title="+ intervent.title + "&date="+  intervent.date + "&duration="+  intervent.duration + "&speaker=" + intervent.speaker + "&session=" + intervent.session + "&status=" + intervent.status;
        console.log(body);
        headers.append("Authorization",window.localStorage.getItem("token"));
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.ServerWithApiUrl + '/createintervent', body, options);   
    }
    updateEvent(event): Observable<Response>{
        console.log(event);
        let headers = new Headers({ 'Content-Type': ['application/x-www-form-urlencoded'] });//application/json
        let body = "id=" + event._id +"&title="+ event.title + "&startDate="+  event.startDate + "&endDate="+  event.endDate + "&location=" + event.location;
        console.log(body);
        headers.append("Authorization",window.localStorage.getItem("token"));
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.ServerWithApiUrl + '/updateevent', body, options);   
    }
    updateSession(session): Observable<Response>{
        console.log(session);
        let headers = new Headers({ 'Content-Type': ['application/x-www-form-urlencoded'] });//application/json
        let body = "id=" + session._id +"&title="+ session.title + "&startDate="+  session.startDate + "&endDate="+  session.endDate;
        console.log(body);
        headers.append("Authorization",window.localStorage.getItem("token"));
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.ServerWithApiUrl + '/updatesession', body, options);   
    }
    updateIntervent(intervent): Observable<Response>{
        console.log(intervent);
        let headers = new Headers({ 'Content-Type': ['application/x-www-form-urlencoded'] });//application/json
        let body = "id=" + intervent._id +"&title="+ intervent.title + "&date="+  intervent.date + "&duration=" +  intervent.duration + "&speaker="+  intervent.speaker;
        console.log(body);
        headers.append("Authorization",window.localStorage.getItem("token"));
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.ServerWithApiUrl + '/updateintervent', body, options);   
    }
    deleteEvent(eventID): Observable<Response>{
        let headers = new Headers({ 'Content-Type': ['application/x-www-form-urlencoded'] });//application/json
        let body = "id=" + eventID;
        console.log(body);
        headers.append("Authorization",window.localStorage.getItem("token"));
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.ServerWithApiUrl + '/deleteevent', body, options);   
    }
    deleteSession(sessionID): Observable<Response>{
        let headers = new Headers({ 'Content-Type': ['application/x-www-form-urlencoded'] });//application/json
        let body = "id=" + sessionID;
        console.log(body);
        headers.append("Authorization",window.localStorage.getItem("token"));
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.ServerWithApiUrl + '/deletesession', body, options);   
    }
    deleteIntervent(interventID): Observable<Response>{
        let headers = new Headers({ 'Content-Type': ['application/x-www-form-urlencoded'] });//application/json
        let body = "id=" + interventID;
        console.log(body);
        headers.append("Authorization",window.localStorage.getItem("token"));
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.ServerWithApiUrl + '/deleteintervent', body, options);   
    }
    openServer(interventID): Observable<Response>{
       let headers = new Headers({ 'Content-Type': ['application/x-www-form-urlencoded'] });//application/json
       let body = "id=" + interventID;
       console.log(body);
       headers.append("Authorization",window.localStorage.getItem("token"));
       let options = new RequestOptions({ headers: headers });
       return this.http.post(this.ServerWithApiUrl + '/openserver', body, options);
    }
    saveInterventText(intervent): Observable<Response>{
        let headers = new Headers({ 'Content-Type': ['application/x-www-form-urlencoded'] });//application/json
        let body = "id=" + intervent._id + "&text="+ intervent.text;
        console.log(body);
        headers.append("Authorization",window.localStorage.getItem("token"));
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.ServerWithApiUrl + '/saveinterventtext', body, options);
    }


}