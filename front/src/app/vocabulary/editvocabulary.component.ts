import {Component} from '@angular/core';
import {FormControl} from "@angular/forms";
import {ActivatedRoute} from '@angular/router';
import { FLAGS} from "../constants";
import {ApiTools} from "../api-tools";
import {Word} from "../../word";
import {CookieService} from "ngx-cookie";
import {VocabularySet} from "../../vocabulary-set";


@Component({
    selector: 'app-editvocabulary',
    template: "<app-createvocabulary [previousUrl]=\"previousUrl\"></app-createvocabulary>"
})
export class EditVocabularyComponent {

    vocab = new FormControl("") as FormControl<string>;
    content: string = "";
    words: Set<Word> = new Set<Word>();
    counter: number = 0;
    previousUrl: string = "";
    firstLanguage: FormControl<string> = new FormControl("Czech") as FormControl<string>;
    secondLanguage: FormControl<string> = new FormControl("English") as FormControl<string>;
    set: VocabularySet | null = null;

    constructor(private route: ActivatedRoute, private cookieService: CookieService) {
        this.route.params.subscribe( params => {
            this.previousUrl = params["vocabUrl"];
        })
    }

    async ngOnInit() {
        const vocabData = await ApiTools.getVocabJson(this.previousUrl, this.cookieService);
        const parsed = JSON.parse(vocabData);
        this.set = new VocabularySet(parsed.name, this.previousUrl, parsed.description,
            FLAGS[parsed.first_language] + " " + parsed.first_language,
            FLAGS[parsed.second_language] + " " + parsed.second_language, [], true
        );
    }

    protected readonly FLAGS = FLAGS;
}
