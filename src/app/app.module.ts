import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { ChatComponent } from './pages/chat/chat.component';

@NgModule({
  declarations: [
    AppComponent,
  ChatComponent
],
imports: [
  BrowserModule,
  AppRoutingModule,
  LoginComponent
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
