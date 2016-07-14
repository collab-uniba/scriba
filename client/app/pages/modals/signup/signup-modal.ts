import { Component } from '@angular/core';
import { FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators, AbstractControl } from '@angular/common';
import {ViewController, NavController, Modal} from 'ionic-angular';
import {UserService} from '../../../services/user-services';
import {User} from '../../../services/models/user-model';
import{LoginPage} from '../login/login-modal'

@Component({
  templateUrl: 'build/pages/modals/signup/signup-modal.html',
  directives: [FORM_DIRECTIVES],
  providers: [UserService]
})
export class SignupPage {
    regForm: ControlGroup;
    name: AbstractControl;
    surname: AbstractControl;
    username: AbstractControl;
    password: AbstractControl;
    email: AbstractControl;

    constructor(private fb: FormBuilder, private viewCtrl: ViewController, private nav: NavController, private us: UserService) {
        
        this.regForm = fb.group({  
            'name': ['', Validators.compose([this.checkFirstCharacterValidator])],
            'surname': ['', Validators.compose([this.checkFirstCharacterValidator])],
            'username': ['', Validators.compose([Validators.minLength(4), this.checkFirstCharacterValidator])],
            'password': ['', Validators.compose([Validators.minLength(8)])],
            'email': ['']
        });

        this.name = this.regForm.controls['name'];     
        this.surname = this.regForm.controls['surname']; 
        this.username = this.regForm.controls['username'];     
        this.password = this.regForm.controls['password'];  
        this.email = this.regForm.controls['email'];  
    }

    checkFirstCharacterValidator(control: Control): { [s: string]: boolean } {  
        if (control.value.match(/^\d/)) {
            return {checkFirstCharacterValidator: true};  
        }       
    }

    onSubmit(value: string): void { 
        if(this.regForm.valid) {
            console.log('Submitted value: ', value);    
            let user = new User(this.name.value, this.surname.value, this.username.value, this.password.value, this.email.value);
            this.us.register(user)
                    .map(res => res.json())
                    .subscribe( (data) =>  { 
                        console.log(data.success);
                        if(data.success){
                            this.viewCtrl.destroy();//dismiss();
                            this.nav.present(Modal.create(LoginPage));
                        }else{
                            alert("Errore di registrazione, Username già in uso!");
                        }
                     });
        }
    }

    close() {
        this.viewCtrl.destroy();//dismiss();
    }
}


