import {Component} from '@angular/core';
import {FormControl} from "@angular/forms";
import {ActivatedRoute} from '@angular/router';
import {ApiTools} from "../api-tools";
import {Word} from "../../word";
import {CookieService} from "ngx-cookie";
import {VocabularySet} from "../../VocabularySet";


@Component({
    selector: 'app-editvocabulary',
    template: "<app-createvocabulary [setID]=\"setID\"></app-createvocabulary>"
})
export class EditVocabularyComponent {

    vocab = new FormControl("") as FormControl<string>;
    content: string = "";
    words: Set<Word> = new Set<Word>();
    setID: number = -1;
    language: FormControl<string> = new FormControl("Czech") as FormControl<string>;
    set: VocabularySet | null = null;

    constructor(private route: ActivatedRoute, private cookieService: CookieService) {
        this.route.params.subscribe( params => {
            this.setID = params["vocabID"];
        })
    }

    async ngOnInit() {
        const vocabData = await ApiTools.getVocabJson(this.setID, this.cookieService);
        const parsed = JSON.parse(vocabData);
        this.set = new VocabularySet(parsed.name, this.setID, parsed.author, parsed.description,
            parsed.first_language, [], true);
    }
}
