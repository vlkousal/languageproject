import {Component, Input} from '@angular/core';
import {FormControl} from "@angular/forms";
import {FLAGS, State} from "../constants";
import {Word} from "../../word";
import {Utils} from "../utils";
import {ApiTools} from "../api-tools";
import {VocabularySet} from "../../vocabulary-set";
import {CookieService} from "ngx-cookie";

interface WordType {
    id: number;
    question: string;
    phonetic: string;
    correct: string;
}

@Component({
  selector: 'app-createvocabulary',
  templateUrl: './createvocabulary.component.html',
  styleUrls: ['./createvocabulary.component.css']
})
export class CreateVocabularyComponent {

    feedback: string = "Please enter a name.";
    languages: string[] = [];

    name: FormControl<string> = new FormControl("") as FormControl<string>;
    description : FormControl<string> = new FormControl("") as FormControl<string>;
    url: FormControl<string> = new FormControl("") as FormControl<string>;
    firstLanguage: FormControl<string> = new FormControl("Albanian") as FormControl<string>;
    secondLanguage: FormControl<string> = new FormControl("Czech") as FormControl<string>;

    @Input() previousUrl: string | null = null;
    words: Word[] = [];

    lastNameLength: number = 0;
    state: State = State.NAME_PAGE;
    isValid: boolean = false
    relevantWords: Set<Word> = new Set<Word>();

    set: VocabularySet | undefined;

    constructor(private cookieService: CookieService) { }

    async ngOnInit(): Promise<void> {
        this.prepLanguages();
        if(this.previousUrl != null) {
            const vocabData = await ApiTools.getVocabJson(this.previousUrl, this.cookieService);
            const parsed = JSON.parse(vocabData);
            this.name.setValue(parsed.name);
            this.url.setValue(this.previousUrl);
            this.description.setValue(parsed.description);
            this.firstLanguage.setValue(FLAGS[parsed.first_language] + " " + parsed.first_language);
            this.secondLanguage.setValue(FLAGS[parsed.second_language] + " " + parsed.second_language);

            parsed.vocabulary.forEach((word: WordType) => {
                this.words.push(new Word(word.id, [], word.question, word.phonetic, word.correct, [], []));
            });
        }
        this.onInputChange();
        await this.getRelevantWords();
    }

    adaptURLText(): void {
        const name = this.getName();
        let urlString = "";
        let limit = 16;
        if(name.length <= 16) limit = name.length;

        for(let i = 0; i < limit; i++) {
            const symbol = Utils.removeDiacritics(name.charAt(i));
            const alphanumericRegex = /^[-_a-zA-Z0-9]$/;
            if(alphanumericRegex.test(symbol)) {
                urlString += symbol;
            } else if(symbol == " " && urlString.charAt(urlString.length - 1) != "-") {
                urlString += "-";
            }
        }
        while(urlString.charAt(urlString.length - 1) == "-") {
            urlString = urlString.slice(0, -1);
        }
        this.url.setValue(Utils.removeDiacritics(urlString).toLowerCase());
    }

    onInputChange(): void {
        this.set = new VocabularySet(this.getName(), this.getUrl(), this.getDescription(),
            this.getFirstLanguage(), this.getSecondLanguage(), this.words, this.previousUrl != null);
        const nameLength = this.getName().length;
        this.isValid = false;
        // we need to refresh the URL string if name was changed
        if(this.lastNameLength != nameLength) {
            this.adaptURLText();
        }

        this.lastNameLength = nameLength;
        if(this.getName().length == 0) {
            this.feedback = "Please enter a name.";
            return;
        }

        if(this.getUrl().length == 0) {
            this.feedback = "The URL is empty.";
            return;
        }

        if(this.getFirstLanguage() == this.getSecondLanguage()) {
            this.feedback = "The languages must be different.";
            return;
        }
        this.isValid = true;
    }

    prepLanguages(): void {
        const keys = Object.keys(FLAGS);

        keys.forEach(lang => {
            this.languages.push(FLAGS[lang] + " " + lang);
        })

        const firstIndex = Math.floor(Math.random() * keys.length);
        let secondIndex = Math.floor(Math.random() * keys.length);
        if(firstIndex == secondIndex) {
            secondIndex = (secondIndex + 1) % keys.length;
        }
        this.firstLanguage.setValue(FLAGS[keys[firstIndex]] + " " + keys[firstIndex]);
        this.secondLanguage.setValue(FLAGS[keys[secondIndex]] + " " + keys[secondIndex]);
    }

    async getRelevantWords(): Promise<void> {
        this.relevantWords = new Set<Word>();
        const parsed = JSON.parse(await ApiTools.getRelevantVocabulary(this.getFirstLanguage(), this.getSecondLanguage()));
        for(let i = 0; i < parsed.words.length; i++) {
            const word = new Word(0, [],  parsed.words[i].first, parsed.words[i].phonetic, parsed.words[i].second, [], []);
            if(!this.relevantWords.has(word)) this.relevantWords.add(word);
        }
    }

    checkNamePage(): void {
        if(this.isValid) this.state = State.WORD_PAGE;
    }

    getName(): string {
        return this.name.getRawValue();
    }

    getUrl(): string {
        return this.url.getRawValue();
    }

    getDescription(): string {
        return this.description.getRawValue();
    }

    // the flag and the space gets removed
    getFirstLanguage(): string {
        return this.firstLanguage.getRawValue().substring(5);
    }

    getSecondLanguage(): string {
        return this.secondLanguage.getRawValue().substring(5);
    }

    protected readonly State = State;
}
