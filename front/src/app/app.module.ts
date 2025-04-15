import { NgModule, isDevMode } from '@angular/core';
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
import { FlashcardsComponent } from './game/flashcards/flashcards.component';
import { OneOfThreeComponent } from './game/one-of-three/one-of-three.component';
import { WriteTheAnswerComponent } from './game/writetheanswer/write-the-answer.component';
import { GameSettingsComponent } from './game/game-settings/game-settings.component';
import { TopPanelComponent } from './top-panel/top-panel.component';
import { EndScreenComponent } from './game/end-screen/end-screen.component';
import { GameComponent } from './game/game-component/game.component';
import { DrawCharactersComponent } from './game/draw-characters/draw-characters.component';
import { VocabTableComponent } from './vocabulary/vocab-table/vocab-table.component';
import {CookieModule} from "ngx-cookie";
import { WordInputComponent } from './vocabulary/word-input/word-input.component';
import { VocabularyCreationSummaryComponent } from './vocabulary/vocabulary-creation-summary/vocabulary-creation-summary.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { LanguageSelectionComponent } from './vocabulary/language-selection/language-selection.component';
import { CategorySelectionComponent } from './vocabulary/category-selection/category-selection.component';
import { VocabularyTextInputComponent } from './vocabulary/vocabulary-text-input/vocabulary-text-input.component';

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
        WordInputComponent,
        VocabularyCreationSummaryComponent,
        NotFoundComponent,
        UserProfileComponent,
        LanguageSelectionComponent,
        CategorySelectionComponent,
        VocabularyTextInputComponent
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot([
            {path: "vocab/:vocabID", component: VocabularyComponent},
            {path: "register", component: RegisterComponent},
            {path: "logout", component: LogoutComponent},
            {path: "login", component: LoginComponent},
            {path: "create", component: CreateVocabularyComponent},
            {path: "", component: IndexComponent},
            {path: "collection", component: CollectionComponent},
            {path: "edit/:vocabID", component: EditVocabularyComponent},
            {path: "user/:username", component: UserProfileComponent},
            {path: "**", component: NotFoundComponent},
        ]),
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        CookieModule.withOptions(),
        ServiceWorkerModule.register('ngsw-worker.js', {
          enabled: !isDevMode(),
          // Register the ServiceWorker as soon as the application is stable
          // or after 30 seconds (whichever comes first).
          registrationStrategy: 'registerWhenStable:30000'
        })
    ],
    providers: [
        { provide: Window, useValue: window },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
