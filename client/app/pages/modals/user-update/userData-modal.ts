import { Component } from '@angular/core';
import { FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators, AbstractControl} from '@angular/common';
import {ViewController, NavController} from 'ionic-angular';
import {UserService} from '../../../services/user-services';
import {User} from '../../../services/models/user-model';
import {PersonalPage} from '../../personal-page/personal-page';

@Component({
  templateUrl: 'build/pages/modals/userData-modal.html',
  //directives: [FORM_DIRECTIVES],
  providers: [UserService]
})
export class UserDataPage {
    private editing={name:false, surname:false, password:false, email:false};
    private changed={name:false, surname:false, password:false, email:false};
    updateForm: ControlGroup;
    passwordForm: ControlGroup;
    oldPassword: AbstractControl;
    newPassword: AbstractControl;
    confirmPassword: AbstractControl;
    name: AbstractControl;
    surname: AbstractControl;
    //password: AbstractControl;
    email: AbstractControl;
    private user: User=new User("","","","","");
    constructor(private fb: FormBuilder, private us: UserService, private viewCtrl: ViewController, private nav: NavController) { 
        this.updateForm = fb.group({  
            'name': ['', Validators.compose([this.checkFirstCharacterValidator])],//, this.checkModified
            'surname': ['', Validators.compose([this.checkFirstCharacterValidator])],
            'email': ['', this.checkEmail]
        });
        this.name = this.updateForm.controls['name'];     
        this.surname = this.updateForm.controls['surname'];     
        this.email = this.updateForm.controls['email'];  

        this.passwordForm = fb.group({
            'oldPassword': ['', Validators.compose([Validators.minLength(8)])],
            'newPassword': ['', Validators.compose([Validators.minLength(8)])],
            'confirmPassword': ['', Validators.compose([Validators.minLength(8)])]   
        },{validator: this.checkPasswords});

        this.oldPassword = this.passwordForm.controls['oldPassword'];
        this.newPassword = this.passwordForm.controls['newPassword'];
        this.confirmPassword = this.passwordForm.controls['confirmPassword'];
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
    checkEmail(control: Control): { [s: string]: boolean } {
        var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
        if (control.value != "" && (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))) {
            return {incorrectMailFormat: true};
        }
    }
    checkPasswords(group: ControlGroup): { [s: string]: boolean } {
        if(group.controls["oldPassword"].value!=group.controls["newPassword"].value){
            if(group.controls["newPassword"].value!=group.controls["confirmPassword"].value){
                return {confirmError: true}
            }
        }else{
            return {oldEqualsNew: true}
        }
    }

    updateStatus(item: string){
        switch(item){
            case "name":
                this.user.name=this.name.value;
                this.changed.name=true; 
                this.editing.name=!this.editing.name;
                break;
            case "surname":
                this.user.surname=this.surname.value;
                this.changed.surname=true; 
                this.editing.surname=!this.editing.surname;
                break;
            case "email":
                this.user.email=this.email.value;
                this.changed.email=true; 
                this.editing.email=!this.editing.email;
                break;
        }
        
    }
    onSubmit(): void { 
        console.log('Submitted value: ', this.user);
        this.us.updateUser(this.user).map(res=>res.json()).subscribe(data=>{
            if(data.success){
                window.localStorage.setItem("user", JSON.stringify(this.user));
                this.viewCtrl.destroy();
                this.nav.setRoot(PersonalPage);
            }else{
                alert(data.msg);
            }
        });
        //this.changed={name:false, surname:false, password:false, email:false};
    }
    onSubmitPassword(value): void { 
            console.log('Submitted value: ', value);    
            this.us.changePassword(value.oldPassword, value.newPassword).map(res=>res.json()).subscribe(data=>{
                console.log(data);
                if(data.success){
                    window.localStorage.setItem("user", JSON.stringify(this.user));
                    this.editing.password=!this.editing.password;
                    //this.viewCtrl.destroy();
                    this.nav.setRoot(PersonalPage);
                }else{
                    alert(data.msg);
                }
            });
    }
    close() {
        this.viewCtrl.destroy();//dismiss();
    }
}

