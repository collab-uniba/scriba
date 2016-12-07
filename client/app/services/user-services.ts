import { Http, Response, Headers,RequestOptions  } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import {User} from './models/user-model';
import {Injectable, Inject} from '@angular/core';
import {Configuration} from './config';


@Injectable() 
export class UserService {
    public isLoggedin;
    private config = new Configuration();
    static get parameters() {
        return [[Http]];
    }
    
    constructor(private http: Http, private usrData: User) {
        this.isLoggedin = false
    }
    
    login(user): Observable<Response>  {
        let body = "username=" + user.username + "&password="+ user.password;
        console.log(body);
        let headers = new Headers({ 'Content-Type': ['application/x-www-form-urlencoded'] });//application/json
        let options = new RequestOptions({ headers: headers });
        let result = this.http.post(this.config.getApiUrl() + '/authenticate', body, options);   
        return result;
    }
    
    register(user: User): Observable<Response>  {
        let body = "name="+ user.name + "&surname="+  user.surname + "&username=" + user.username + "&password="+ user.password + "&email=" + user.email;
        let headers = new Headers({ 'Content-Type': ['application/x-www-form-urlencoded'] });//application/json
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.config.getApiUrl() + '/signup', body, options);      
    }

    getUserData(): Observable<Response>{
        let headers = new Headers({ 'Content-Type': ['application/x-www-form-urlencoded'] });//application/json
        headers.append("Authorization",window.localStorage.getItem("token"));
        let options = new RequestOptions({ headers: headers });
        let result = this.http.get(this.config.getApiUrl() + '/memberinfo', options);
        return result;
    }
    updateUser(user: User): Observable<Response>{
        let body = "name="+ user.name + "&surname="+  user.surname + "&email=" + user.email;
        let headers = new Headers({ 'Content-Type': ['application/x-www-form-urlencoded'] });//application/json
        headers.append("Authorization",window.localStorage.getItem("token"));
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.config.getApiUrl() + '/updateuser', body, options);      
    }

    changePassword(oldPassword: string, newPassword: string): Observable<Response>{
        let body = "oldPassword=" + oldPassword +"&newPassword=" + newPassword;
        let headers = new Headers({ 'Content-Type': ['application/x-www-form-urlencoded'] });//application/json
        headers.append("Authorization",window.localStorage.getItem("token"));
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.config.getApiUrl() + '/updatepassword', body, options);
    }

    logout() {
        console.log(window.localStorage.getItem("token"));
        this.isLoggedin = false;
        window.localStorage.clear();
    }

    addObservedEvent(eventID): Observable<Response>{
        let body = "id=" + eventID;
        let headers = new Headers({ 'Content-Type': ['application/x-www-form-urlencoded'] });//application/json
        headers.append("Authorization",window.localStorage.getItem("token"));
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.config.getApiUrl() + '/addobservedevent', body, options);
    }
    
    removeObservedEvent(eventID): Observable<Response>{
        let body = "id=" + eventID;
        let headers = new Headers({ 'Content-Type': ['application/x-www-form-urlencoded'] });//application/json
        headers.append("Authorization",window.localStorage.getItem("token"));
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.config.getApiUrl() + '/removeobservedevent', body, options);
    }

    addJoinedEvent(eventID): Observable<Response>{
        let body = "id=" + eventID;
        let headers = new Headers({ 'Content-Type': ['application/x-www-form-urlencoded'] });//application/json
        headers.append("Authorization",window.localStorage.getItem("token"));
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.config.getApiUrl() + '/addjoinedevent', body, options);
    }
    
    removeJoinedEvent(eventID): Observable<Response>{
        let body = "id=" + eventID;
        let headers = new Headers({ 'Content-Type': ['application/x-www-form-urlencoded'] });//application/json
        headers.append("Authorization",window.localStorage.getItem("token"));
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.config.getApiUrl() + '/removejoinedevent', body, options);
    }
}