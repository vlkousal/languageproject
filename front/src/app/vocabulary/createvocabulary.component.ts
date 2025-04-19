import {Component, Input} from '@angular/core';
import {FormControl} from "@angular/forms";
import {BACKEND, Category, Language, WordInterface} from "../constants";
import {VocabularySet} from "../../VocabularySet";
import {CookieService} from "ngx-cookie";
import { HttpClient } from '@angular/common/http';
import {map, Observable} from "rxjs";

enum State {
    LANGUAGE_SELECTION = 0,
    CATEGORY_SELECTION = 1,
    WORD_INPUT = 2,
    NAME_PAGE = 3,
}

@Component({
  selector: 'app-createvocabulary',
  templateUrl: './createvocabulary.component.html',
  styleUrls: ['./createvocabulary.component.css']
})
export class CreateVocabularyComponent {

    feedback: string = "Please enter a name.";

    languages: Language[] = [];
    categories: Category[] = [];
    selectedLanguage: Language | null = null;
    selectedCategory: Category | null = null;

    name: FormControl<string> = new FormControl("") as FormControl<string>;
    description : FormControl<string> = new FormControl("") as FormControl<string>;

    @Input() setID: number | null = null;
    words: Set<WordInterface> = new Set<WordInterface>();

    lastNameLength: number = 0;
    state: State = State.LANGUAGE_SELECTION;
    isValid: boolean = false
    relevantWords: Set<WordInterface> = new Set<WordInterface>();

    set: VocabularySet | undefined;

    constructor(private cookieService: CookieService, private http: HttpClient) { }

    async ngOnInit(): Promise<void> {
        this.getLanguages().subscribe(languages => this.languages = languages);
        this.getVocabularyCategories().subscribe(categories => this.categories = categories);

        /*
        if(this.setID != null) {
            const vocabData = await ApiTools.getVocabJson(this.setID, this.cookieService);
            const parsed = JSON.parse(vocabData);
            this.name.setValue(parsed.name);
            this.description.setValue(parsed.description);

            parsed.vocabulary.forEach((word: WordInterface) => {
                this.words.add({word.})
                this.words.add(new Word(word.id, [], word.question, word.phonetic, word.correct, [], []));
            });
        }
         */
        this.onInputChange();
        //await this.getRelevantWords();
    }

    onInputChange(): void {
        //this.set = new VocabularySet(this.getName(), -1, "", this.getDescription(),
        //  this.getLanguage(), this.words, this.setID != null);
        const name = this.name.value;
        const nameLength = name.length;
        this.isValid = false;

        this.lastNameLength = nameLength;
        if(name.length == 0) {
            this.feedback = "Please enter a name.";
            return;
        }
        this.isValid = true;
    }

    /*
    async getRelevantWords(): Promise<void> {
        this.relevantWords = new Set<Word>();
        const parsed = JSON.parse(await ApiTools.getRelevantVocabulary(this.getLanguage()));
        for(let i = 0; i < parsed.words.length; i++) {
            const word = new Word(0, [],  parsed.words[i].first, parsed.words[i].phonetic, parsed.words[i].second, [], []);
            if(!this.relevantWords.has(word)) this.relevantWords.add(word);
        }
    }
     */

    getLanguages(): Observable<Language[]> {
        return this.http.get<{ languages: Language[] }>(`${BACKEND}api/getlanguages/`)
            .pipe(
                map(response => response.languages)
            )
    }

    getVocabularyCategories(): Observable<Category[]> {
        return this.http.get<{ categories: Category[] }>(`${BACKEND}api/getvocabcategories/`)
            .pipe(
                map(response => response.categories)
            );
    }

    onCreate(): void {
        if(this.words.size == 0){
            this.feedback = "You need at least one valid word.";
            return;
        }

        const json = {
            token: this.cookieService.get("token"),
            name: this.name.value,
            description: this.description.value,
            language: this.selectedLanguage?.name,
            category: this.selectedCategory?.name,
            vocabulary: this.getVocabularyJSON()
        }

        fetch(BACKEND + "api/createvocab/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(json),
        }).then(async response => {
            if(response.ok) {
                return;
            }
        })
    }

    getVocabularyJSON(): { first: string; phonetic: string; second: string }[] {
        const json: { first: string; phonetic: string; second: string }[] = [];
        this.words.forEach(word => {
            json.push({"first": word.first, "phonetic": word.phonetic, "second": word.second});
        });
        return json;
    }

    protected readonly State = State;
}
