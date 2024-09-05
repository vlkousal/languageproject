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
import {IndexComponent} from "./base/index.component";
import { CollectionComponent } from './collection/collection.component';
import {EditVocabularyComponent} from "./vocabulary/editvocabulary.component";
import { FlashcardsComponent } from './flashcards/flashcards.component';
import { OneOfThreeComponent } from './one-of-three/one-of-three.component';
import { WriteTheAnswerComponent } from './writetheanswer/write-the-answer.component';
import { GameSettingsComponent } from './game-settings/game-settings.component';
import { TopPanelComponent } from './top-panel/top-panel.component';
import { EndScreenComponent } from './end-screen/end-screen.component';
import { GameComponent } from './game-component/game.component';
import { DrawCharactersComponent } from './draw-characters/draw-characters.component';
import { VocabTableComponent } from './vocab-table/vocab-table.component';
import {CookieModule} from "ngx-cookie";
import { ManageSetComponent } from './manage-set/manage-set.component';

@NgModule({
    declarations: [
        AppComponent,
        RegisterComponent,
        VocabularyComponent,
        BaseComponent,
        LogoutComponent,
        LoginComponent,
        CreateVocabularyComponent,
        IndexComponent,
        CollectionComponent,
        EditVocabularyComponent,
        FlashcardsComponent,
        OneOfThreeComponent,
        WriteTheAnswerComponent,
        GameSettingsComponent,
        TopPanelComponent,
        EndScreenComponent,
        GameComponent,
        DrawCharactersComponent,
        VocabTableComponent,
        ManageSetComponent
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot([
            {path: "vocab/:vocabUrl", component: VocabularyComponent},
            {path: "register", component: RegisterComponent},
            {path: "logout", component: LogoutComponent},
            {path: "login", component: LoginComponent},
            {path: "create", component: ManageSetComponent},
            {path: "", component: IndexComponent},
            {path: "collection", component: CollectionComponent},
            {path: "edit/:vocabUrl", component: EditVocabularyComponent}
        ]),
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        CookieModule.withOptions()
    ],
    providers: [
        { provide: Window, useValue: window },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
