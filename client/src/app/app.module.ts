import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

import { MyApp } from './app.component';
import { AboutPage } from "../pages/about-page/about-page";
import { ContactPage } from "../pages/contact-page/contact-page";
import { EventPage } from "../pages/event-page/event-page";
import { HomePage } from "../pages/home-page/home-page";
import { InterventPage } from "../pages/intervent-page/intervent-page";
import { JoinedEventsPage } from "../pages/joined-events-page/joined-events-page";
import { ListenInterventPage } from "../pages/listen-intervent-page/listen-intervent-page";
import { ObservedEventsPage } from "../pages/observed-events-page/observed-events-page";
import { PersonalEventsPage } from "../pages/personal-events-page/personal-events-page";
import { PersonalHomePage } from "../pages/personal-home-page/personal-home-page";
import { PersonalPage } from "../pages/personal-page/personal-page";
import { SessionPage } from "../pages/session-page/session-page";
import { TabsPage } from "../pages/tabs/tabs";

import { NewEventPage } from "../pages/modals/event/event-modal";
import { NewInterventPage } from "../pages/modals/intervent/intervent-modal";
import { LoginPage } from "../pages/modals/login/login-modal";
import { NewSessionPage } from "../pages/modals/session/session-modal";
import { SignupPage } from "../pages/modals/signup/signup-modal";
import { UserDataPage } from "../pages/modals/user-update/userData-modal";

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    EventPage,
    HomePage,
    JoinedEventsPage,
    ListenInterventPage,
    ObservedEventsPage,
    PersonalEventsPage,
    PersonalHomePage,
    PersonalPage,
    SessionPage,
    TabsPage,
    ContactPage,
    NewEventPage,
    NewInterventPage,
    LoginPage,
    NewSessionPage,
    SignupPage,
    UserDataPage,
    InterventPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PersonalPage,
    TabsPage,
    HomePage,
    AboutPage,
    EventPage,
    HomePage,
    JoinedEventsPage,
    ListenInterventPage,
    ObservedEventsPage,
    PersonalEventsPage,
    PersonalHomePage,
    PersonalPage,
    SessionPage,
    TabsPage,
    ContactPage,
    NewEventPage,
    NewInterventPage,
    LoginPage,
    NewSessionPage,
    SignupPage,
    UserDataPage,
    InterventPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
