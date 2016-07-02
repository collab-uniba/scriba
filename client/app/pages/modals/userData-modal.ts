import { Component } from '@angular/core';
import { FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators, AbstractControl } from '@angular/common';
import {ViewController, NavController} from 'ionic-angular';
import {UserService} from '../../services/user-services';
import {User} from '../../services/user-model';

@Component({
  templateUrl: 'build/pages/modals/userData-modal.html',
  //directives: [FORM_DIRECTIVES],
  providers: [UserService]
})
export class UserDataPage {
    private editing={name:false, surname:false, username:false, password:false, email:false};
    updateForm: ControlGroup;
    name: AbstractControl;
    surname: AbstractControl;
    username: AbstractControl;
    //password: AbstractControl;
    email: AbstractControl;
    private user: User=new User("","","","","");
    constructor(private fb: FormBuilder, private us: UserService, private viewCtrl: ViewController) {//,  private nav: NavController, 
        this.updateForm = fb.group({  
            'name': ['', Validators.compose([this.checkFirstCharacterValidator])],
            'surname': ['', Validators.compose([this.checkFirstCharacterValidator])],
            'username': ['', Validators.compose([Validators.minLength(4), this.checkFirstCharacterValidator])],
            //'password': ['', Validators.compose([Validators.minLength(8)])],
            'email': ['']
        });

        this.name = this.updateForm.controls['name'];     
        this.surname = this.updateForm.controls['surname']; 
        this.username = this.updateForm.controls['username'];     
        //this.password = this.updateForm.controls['password'];  
        this.email = this.updateForm.controls['email'];  
    }

    ionViewWillEnter(){
        let localUser=JSON.parse(window.localStorage.getItem("user"));
        this.user= new User(localUser.name, localUser.surname, localUser.username, localUser.password, localUser.email);
    }

    checkFirstCharacterValidator(control: Control): { [s: string]: boolean } {  
        if (control.value.match(/^\d/)) {
            return {checkFirstCharacterValidator: true};  
        }       
    }

    onSubmit(value: string): void { 
        //if(this.updateForm.valid) {
            console.log('Submitted value: ', value);    
            let user = new User(this.name.value, this.surname.value, this.username.value, "password", this.email.value);
            console.log(user);
            /*this.us.update(user)
                    .map(res => res.json())
                    .subscribe( (data) =>  { 
                        console.log(data.success);
                        if(data.success){
                            this.viewCtrl.destroy();//dismiss();
                            this.nav.present(Modal.create(LoginPage));
                        }else{
                            alert("Errore di Registrazione, Username già in uso!");
                        }
                     });*/
       //}
    }

    close() {
        this.viewCtrl.destroy();//dismiss();
    }
}

