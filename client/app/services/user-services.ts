import { Http, Response, Headers,RequestOptions  } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import {User} from './user-model';
import {Injectable, Inject} from '@angular/core';


@Injectable() 
export class UserService {
    public isLoggedin;
    private ServerWithApiUrl = "http://localhost:8080/api";
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
        let result = this.http.post(this.ServerWithApiUrl + '/authenticate', body, options);   
        return result;
    }
    
    register(user: User): Observable<Response>  {
        let body = "name="+ user.name + "&surname="+  user.surname + "&username=" + user.username + "&password="+ user.password + "&email=" + user.email;
        let headers = new Headers({ 'Content-Type': ['application/x-www-form-urlencoded'] });//application/json
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.ServerWithApiUrl + '/signup', body, options);      
    }

    getUserData(): Observable<Response>{
        let headers = new Headers({ 'Content-Type': ['application/x-www-form-urlencoded'] });//application/json
        headers.append("Authorization",window.localStorage.getItem("token"));
        let options = new RequestOptions({ headers: headers });
        let result = this.http.get(this.ServerWithApiUrl + '/memberinfo', options);
        return result;
    }
    updateUser(user: User): Observable<Response>{
        let body = "name="+ user.name + "&surname="+  user.surname + "&email=" + user.email;
        let headers = new Headers({ 'Content-Type': ['application/x-www-form-urlencoded'] });//application/json
        headers.append("Authorization",window.localStorage.getItem("token"));
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.ServerWithApiUrl + '/updateuser', body, options);      
    }

    changePassword(oldPassword: string, newPassword: string): Observable<Response>{
        let body = "oldPassword=" + oldPassword +"&newPassword=" + newPassword;
        let headers = new Headers({ 'Content-Type': ['application/x-www-form-urlencoded'] });//application/json
        headers.append("Authorization",window.localStorage.getItem("token"));
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.ServerWithApiUrl + '/updatepassword', body, options);
    }

    logout() {
        console.log(window.localStorage.getItem("token"));
        this.isLoggedin = false;
        window.localStorage.clear();
    }
}