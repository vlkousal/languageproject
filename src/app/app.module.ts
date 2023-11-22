import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RegisterComponent } from './user/register.component';
import { RouterModule } from "@angular/router";
import { VocabularyComponent } from './vocabulary/vocabulary.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { BaseComponent } from './base/base.component';
import {LogoutComponent} from "./user/logout.component";
import {LoginComponent} from "./user/login.component";
import {CreateVocabularyComponent} from "./vocabulary/createvocabulary.component";
@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    VocabularyComponent,
    BaseComponent,
    LogoutComponent,
    LoginComponent,
    CreateVocabularyComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {path: "vocab/:vocabUrl", component: VocabularyComponent},
      {path: "register", component: RegisterComponent},
      {path: "logout", component: LogoutComponent},
      {path: "login", component: LoginComponent},
      {path: "create", component: CreateVocabularyComponent}
    ]),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    { provide: Window, useValue: window },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
