import {Component, EventEmitter, Input, Output} from '@angular/core';
import {VocabularySet} from "../../vocabulary-set";
import {BACKEND, FLAGS} from "../constants";
import {Word} from "../../word";
import {CookieService} from "ngx-cookie";
import {Router} from "@angular/router";

@Component({
    selector: 'app-vocabulary-creation-summary',
    templateUrl: './vocabulary-creation-summary.component.html',
    styleUrls: ['./vocabulary-creation-summary.component.css']
})
export class VocabularyCreationSummaryComponent {

    @Input() set: VocabularySet = new VocabularySet("", "", "", "", "", true);
    @Input() words: Set<Word> = new Set<Word>();

    @Output() onGoBack: EventEmitter<void> = new EventEmitter();

    feedback: string = "";

    constructor(private router: Router, private cookieService: CookieService) { }

    onCreate(): void {
        if(this.words.size == 0){
            this.feedback = "You need at least one valid word.";
            return;
        }

        const json = {
            token: this.cookieService.get("token"),
            name: this.set.name,
            url: this.set.url,
            description: this.set.description,
            first_language: this.set.firstLanguage,
            second_language: this.set.secondLanguage,
            vocabulary: this.getVocabularyJSON()
        }

        fetch(BACKEND + "api/createvocab/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(json),
        }).then(async response => {
            if(response.ok){
                await this.router.navigate(["/vocab/" + this.set.url]);
                return;
            }
            this.feedback = (await response.text()).slice(1, -1);
        })
    }

    getVocabularyJSON(): { first: string; phonetic: string; second: string }[] {
        const json: { first: string; phonetic: string; second: string }[] = [];
        this.words.forEach(word => {
            json.push({"first": word.question, "phonetic": word.phonetic, "second": word.correct});
        });
        return json;
    }

    protected readonly FLAGS = FLAGS;
}
