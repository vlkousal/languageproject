import {Component} from '@angular/core';
import {FormControl} from "@angular/forms";
import {ActivatedRoute, Router} from '@angular/router';
import {BACKEND, FLAGS} from "../constants";
import {ApiTools} from "../api-tools";
import {Word} from "../../word";
import {CookieService} from "ngx-cookie";


@Component({
  selector: 'app-editvocabulary',
  templateUrl: './editvocabulary.component.html',
  styleUrls: ['./editvocabulary.component.css']
})
export class EditVocabularyComponent {

    vocab = new FormControl("") as FormControl<string>;
    content: string = "";
    words: Set<Word> = new Set<Word>();
    counter: number = 0;
    name: FormControl<string> = new FormControl("") as FormControl<string>;
    description : FormControl<string> = new FormControl("") as FormControl<string>;
    url: FormControl<string> = new FormControl("") as FormControl<string>;
    previousurl: string = "";
    firstLanguage: FormControl<string> = new FormControl("Czech") as FormControl<string>;
    secondLanguage: FormControl<string> = new FormControl("English") as FormControl<string>;

    constructor(private route: ActivatedRoute, private cookieService: CookieService) { }

    async ngOnInit() {
        this.route.params.subscribe( params => {
            this.url.setValue(params["vocabUrl"]);
            this.previousurl = params["vocabUrl"];
        })
        const vocabData = await ApiTools.getVocabJson(this.url.getRawValue(), this.cookieService);
        const parsed = JSON.parse(vocabData);
        this.name.setValue(parsed.name);
        this.description.setValue(parsed.description);
        this.firstLanguage.setValue(FLAGS[parsed.first_language] + " " + parsed.first_language);
        this.secondLanguage.setValue(FLAGS[parsed.second_language] + " " + parsed.second_language);
    }

    protected readonly FLAGS = FLAGS;
}
