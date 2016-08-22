import { Component } from '@angular/core';
import {NgForm} from '@angular/forms';
import {NavController, NavParams, Modal, Alert} from 'ionic-angular';
import {EventService} from '../../services/event-services';
import {Events} from 'ionic-angular';

//IMPORT MODELS
import {User} from '../../services/models/user-model';
import {Session} from '../../services/models/session-model';

//IMPORT PAGES - MODALS
import {NewInterventPage} from '../modals/intervent/intervent-modal';
import {InterventPage} from '../intervent-page/intervent-page';

@Component({
  templateUrl: 'build/pages/session-page/session-page.html',
  providers: [EventService]
})
export class SessionPage {
  //GETS CURRENT USER
  private localUser=JSON.parse(window.localStorage.getItem("user"));
  private user= new User(this.localUser.name, this.localUser.surname, this.localUser.username, this.localUser.password, this.localUser.email);    

  //SETS PASSED EVENT
  private updating = false;
  private event = this.np.get('event');
  private session = this.np.get('session');
  private newData;
  private overlapError = {status: false, session: null};

  //SETS SESSION INTERVENTS
  private intervents = [];

  constructor(private nav: NavController, private np: NavParams, private es: EventService, private evts: Events) {
    //this.session
    console.log(this.session);
    this.newData = {_id: this.session._id, title:this.session.title, startDate: this.session.startDate, endDate: this.session.endDate};
  }

  ionViewWillEnter(){
	  this.updateIntervents(this.session._id);
  }
  
  overlap(): Session{
      let overlap = null;
      let sessions=this.np.get('sessions');
      sessions.forEach(sessionInList => {
        if(sessionInList._id!=this.newData._id){
          console.log(this.newData.startDate);
          console.log(this.newData.endDate);
          console.log(sessionInList.startDate);
          console.log(sessionInList.endDate);
          if((sessionInList.startDate < this.newData.startDate && this.newData.startDate < sessionInList.endDate) || 
              (sessionInList.startDate < this.newData.endDate && this.newData.endDate < sessionInList.endDate) ||
              (this.newData.startDate < sessionInList.startDate && sessionInList.endDate < this.newData.endDate)){
              console.log(sessionInList);
              overlap = sessionInList;
          }
        }
      });
      return overlap;
  }

  updateIntervents(sessionID){
    let _intervents = [];

    this.es.getIntervents(sessionID).map(res=> res.json()).subscribe((data) => {
      console.log(data);
      data.data.forEach(intervent =>{
            intervent.expanded=false;
            _intervents.push(intervent);
          })
          this.intervents=_intervents;
      });
  }
  submit(){
    this.overlapError.status = false;
    this.overlapError.session = null;
    console.log(this.overlapError);
    let olp = this.overlap();
    if(olp!=null){
        this.overlapError.status=true;
        this.overlapError.session=olp;
        console.log(this.overlapError);
        let confirm = Alert.create({
          title: 'La Sessione è contemporanea ad altre Sessioni, salvare comunque?',
          message: 'La Sessione si sovrappone con: "'+this.overlapError.session.title
          +'" prevista dal '+this.overlapError.session.startDate
          +' al '+this.overlapError.session.endDate,
          buttons: [
            {
              text: 'Salva',
              handler: () => this.saveSession()
            },
            {
              text: 'Modifica'
            }
          ]
        });
        this.nav.present(confirm);
    }else{
      this.saveSession();
    }
  }

  saveSession(){
    if(this.newData.startDate==null){
        this.newData.startDate=this.session.startDate;
      }
      if(this.newData.endDate==null){
        this.newData.endDate=this.session.endDate;
      }
      this.es.updateSession(this.newData).map(res=>res.json()).subscribe(data=>{
        console.log(data);
        if(data.success){
          this.nav.pop()
        }else{
          alert(data.msg)
        }
      })
  }
  reset(){
    this.newData={_id: this.session._id, title:this.session.title, startDate: this.session.date, endDate: this.session.endDate};
    this.updating=false;
  }

  newIntervent(){
    this.evts.subscribe('reloadSessionPage',() => {
      this.updateIntervents(this.session._id);
    });
    let modal = Modal.create(NewInterventPage, {session: this.session, intervents: this.intervents});
    this.nav.present(modal);
  }
  openIntervent(interventToOpen){
      //SOLO SE è TRA GLI SPEAKER
      this.nav.push(InterventPage, {
          session: this.session,
          intervents: this.intervents,
          intervent: interventToOpen
        })
  }

  deleteIntervent(intervent){
    if(intervent.status=="ongoing"){
      alert("Impossibile eliminare la sessione poichè è ancora IN CORSO!")
    }else{
      let confirm = Alert.create({
        title: 'Cancellare questo Intervento?',
        message: 'Se cancelli questo intervento, non sarà più possibile ripristinarlo!',
        buttons: [
          {
            text: 'Cancella',
            handler: () => {
              console.log('Cancellalo');
              this.es.deleteIntervent(intervent._id).map(res=>res.json()).subscribe(data=>{
                if (data.success) {
                  this.updateIntervents(this.session._id);
                }else{
                  alert(data.msg)
                }
              });
            }
          },
          {
            text: 'Mantieni'
          }
        ]
      });
      this.nav.present(confirm);
    }
  }

  close() {
      this.nav.pop();
  }
}