import { Component } from '@angular/core';
import {NavController} from 'ionic-angular';
import {NgForm} from '@angular/forms';
import {UserService} from '../../../services/user-services';
import {PersonalPage} from '../../personal-page/personal-page';

@Component({
  templateUrl: 'build/pages/modals/login/login-modal.html',
  providers: [UserService]
})
export class LoginPage {
    private username: string;
    private password: string;

    constructor(private nav: NavController, private us: UserService ) {
        
    }

    submit(): void {   
        let user = {username: this.username, password: this.password};
        this.us.login(user).map(res => res.json()).subscribe( data => {
            console.log(data);
            if(data.success){
                window.localStorage.setItem("token", data.token);
                console.log(data.token);
                this.us.isLoggedin=true;
                this.nav.setRoot(PersonalPage);
            }else{
                alert(data.msg);
            }
        });
    }

    close() {
        this.nav.pop();
    }
}

