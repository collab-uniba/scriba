import { Component } from '@angular/core';
import {ViewController, NavController} from 'ionic-angular';
import { FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators, AbstractControl } from '@angular/common';
import {UserService} from '../../../services/user-services';
import {PersonalPage} from '../../personal-page/personal-page';

@Component({
  templateUrl: 'build/pages/modals/login-modal.html',
  directives: [FORM_DIRECTIVES],
  providers: [UserService]
})
export class LoginPage {
    loginForm: ControlGroup;
    username: AbstractControl;
    password: AbstractControl;
    submitted = false;

    constructor(private fb: FormBuilder, private viewCtrl: ViewController, private nav: NavController, private us: UserService ) {
        
        this.loginForm = fb.group({  
            'username': [''],
            'password': ['']
        });
        
        this.username = this.loginForm.controls['username'];     
        this.password = this.loginForm.controls['password'];  
    }

    onSubmit(value: string): void { 
        if(this.loginForm.valid) {
            console.log('Submitted value: ', value);    
            let user = {username: this.username.value, password: this.password.value};
            this.us.login(user)
                    .map(res => res.json())
                    .subscribe( (data) =>  { 
                        console.log(data);
                        if(data.success){
                            window.localStorage.setItem("token", data.token);
                            console.log(data.token);
                            this.us.isLoggedin=true;
                            this.nav.setRoot(PersonalPage);//.push(PersonalPage) ha lo stesso effetto ... non so perchè!!!
                        }else{
                            alert(data.msg);
                        }
                     });
        }
    }

    close() {
        this.viewCtrl.destroy();//dismiss();
    }
}

