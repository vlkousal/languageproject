import {Component, Input} from '@angular/core';
import {FormControl} from "@angular/forms";
import {FLAGS, State} from "../constants";
import {Word} from "../../word";
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

    language: FormControl<string> = new FormControl("") as FormControl<string>;

    @Input() setID: number | null = null;
    words: Word[] = [];

    lastNameLength: number = 0;
    state: State = State.NAME_PAGE;
    isValid: boolean = false
    relevantWords: Set<Word> = new Set<Word>();

    set: VocabularySet | undefined;

    constructor(private cookieService: CookieService) { }

    async ngOnInit(): Promise<void> {
        this.languages = await ApiTools.getLanguages();
        if(this.languages.length != 0) {
            const randomIndex: number = Math.floor(Math.random() * this.languages.length);
            this.language.setValue(this.languages[randomIndex]);
        }
        if(this.setID != null) {
            const vocabData = await ApiTools.getVocabJson(this.setID, this.cookieService);
            const parsed = JSON.parse(vocabData);
            this.name.setValue(parsed.name);
            this.description.setValue(parsed.description);
            this.language.setValue(FLAGS[parsed.first_language] + " " + parsed.first_language);

            parsed.vocabulary.forEach((word: WordType) => {
                this.words.push(new Word(word.id, [], word.question, word.phonetic, word.correct, [], []));
            });
        }
        this.onInputChange();
        await this.getRelevantWords();
    }

    onInputChange(): void {
        this.set = new VocabularySet(this.getName(), -1, this.getDescription(),
            this.getLanguage(), this.words, this.setID != null);
        const nameLength = this.getName().length;
        this.isValid = false;

        this.lastNameLength = nameLength;
        if(this.getName().length == 0) {
            this.feedback = "Please enter a name.";
            return;
        }
        this.isValid = true;
    }

    async getRelevantWords(): Promise<void> {
        this.relevantWords = new Set<Word>();
        const parsed = JSON.parse(await ApiTools.getRelevantVocabulary(this.getLanguage()));
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

    getDescription(): string {
        return this.description.getRawValue();
    }

    // the flag and the space gets removed
    getLanguage(): string {
        return this.language.getRawValue();
    }

    protected readonly State = State;
}
