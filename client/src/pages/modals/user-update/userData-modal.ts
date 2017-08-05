import { Component } from '@angular/core';
import {NgForm} from '@angular/forms';
import {NavController, NavParams, Events} from 'ionic-angular';
import {UserService} from '../../../services/user-services';
import {User} from '../../../services/models/user-model';

@Component({
  templateUrl: 'userData-modal.html',
  providers: [UserService, NgForm]
})
export class UserDataPage {
    private oldUser: User;
    private user: User;
    private oldPassword: string;
    private newPassword: string;
    private editingPassword=false;
    constructor(private evts: Events, private np: NavParams, private us: UserService, private nav: NavController) { 
        this.oldUser=this.np.get('user');
        this.user = new User(this.oldUser.name,this.oldUser.surname, this.oldUser.username, this.oldUser.password, this.oldUser.email);
    }

    submit(): void { 
        console.log('Submitted value: ', this.user);
        this.us.updateUser(this.user).map(res=>res.json()).subscribe(data=>{
            if(data.success){
                window.localStorage.setItem("user", JSON.stringify(this.user));
                this.evts.publish("reloadUserData");
                this.nav.pop();
            }else{
                alert(data.msg);
            }
        });
    }
    submitPassword(value): void { 
            console.log('Submitted value: ', value);    
            this.us.changePassword(this.oldPassword, this.newPassword).map(res=>res.json()).subscribe(data=>{
                console.log(data);
                if(data.success){
                    window.localStorage.setItem("user", JSON.stringify(this.user));
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

