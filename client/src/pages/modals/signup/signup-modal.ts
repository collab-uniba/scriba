import { Component } from '@angular/core';
import {NgForm} from '@angular/forms';
import {NavController} from 'ionic-angular';
import {UserService} from '../../../services/user-services';
import {User} from '../../../services/models/user-model';

@Component({
  templateUrl: 'signup-modal.html',
  providers: [UserService]
})
export class SignupPage {
    user: User= new User("","","","","");
    constructor(private nav: NavController, private us: UserService) {
    }

    submit(){
        console.log(this.user);
        this.us.register(this.user).map(res => res.json()).subscribe( data => { 
            console.log(data.success);
            if(data.success){
                this.nav.pop();
            }else{
                alert(data.msg);
            }
        });
    }

    close() {
        this.nav.pop();
    }
}


