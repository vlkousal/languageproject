import {Component} from '@angular/core';
import {FormControl} from "@angular/forms";
import {BACKEND, FLAGS, Word} from "../constants";
import {ApiTools} from "../apitools";
import {Router} from "@angular/router";

@Component({
  selector: 'app-createvocabulary',
  templateUrl: './createvocabulary.component.html',
  styleUrls: ['./createvocabulary.component.css']
})
export class CreateVocabularyComponent {

    vocab = new FormControl("") as FormControl<string>;
    delimiter = new FormControl(";") as FormControl<string>;
    content: string = "";
    firstFeedback: string = "Please enter a name.";
    words: Set<Word> = new Set<Word>();
    languages: string[] = Object.keys(FLAGS);
    counter: number = 0;
    name: FormControl<string> = new FormControl("") as FormControl<string>;
    description : FormControl<string> = new FormControl("") as FormControl<string>;
    url: FormControl<string> = new FormControl("") as FormControl<string>;
    firstLanguage: FormControl<string> = new FormControl("Albanian") as FormControl<string>;
    secondLanguage: FormControl<string> = new FormControl("Czech") as FormControl<string>;
    firstPart: boolean = true;
    lastNameLength: number = 0;
    relevantWords: Set<Word> = new Set<Word>();
    filter: FormControl<string> = new FormControl("") as FormControl<string>;
    filteredRelevantWords: Set<Word> = new Set<Word>();

    constructor(private router: Router) { }

    ngOnInit() {
        this.randomizeLanguages();
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if(input == null || input.files == null) {
            return;
        }
        const selectedFile = input.files[0];
        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
            if(e.target != null && e.target.result != null) {
                this.content = e.target.result.toString();
                this.onInputChange();
            }
        };
        reader.readAsText(selectedFile);
    }

    goBack() {
        this.firstPart = true;
    }

    async onContinue() {
        if(this.isFirstInputValid()) {
            this.relevantWords = new Set<Word>();
            this.firstPart = false;
            const firstLanguage: string = this.firstLanguage.getRawValue();
            const secondLanguage: string = this.secondLanguage.getRawValue();
            const parsed = JSON.parse(await ApiTools.getRelevantVocabulary(firstLanguage, secondLanguage));
            for(let i = 0; i < parsed.words.length; i++) {
                const word = new Word(0,0,  parsed.words[i].first, parsed.words[i].phonetic, parsed.words[i].second, []);
                if(!this.containsWord(this.relevantWords, word)) {
                    this.relevantWords.add(word);
                }
            }
            this.filteredRelevantWords = this.relevantWords;
        }
    }

    onSend() {
        if(this.counter >= 3) {
            const vocabString = this.vocab.getRawValue().replaceAll(this.delimiter.getRawValue(), ";");
            const json = {
                "session_id": localStorage.getItem("sessionId"),
                "name": this.name.getRawValue(),
                "description": this.description.getRawValue(),
                "url": this.url.getRawValue(),
                "first_language": this.firstLanguage.getRawValue(),
                "second_language": this.secondLanguage.getRawValue(),
                "vocabulary": vocabString
            }

            fetch(BACKEND + "api/createvocab/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(json),
            }).then(async response => {
                if(response.ok) {
                    this.router.navigate(["/vocab/" + this.url.getRawValue()]);
                }
            })
        }
    }

    isValidLine(line: string) {
        const splitLine: string[] = line.split(this.delimiter.getRawValue());
        return splitLine.length == 3;
    }

    addWord(word: Word) {
        if(!this.containsWord(this.words, word)) {
            const delimeter = this.delimiter.getRawValue();
            if(this.content.charAt(this.content.length - 1) != "\n" && this.content.charAt(this.content.length - 1) != "") {
                this.content += "\n";
            }
            this.content += word.question + delimeter + word.phonetic + delimeter + word.correct + "\n";
            this.onInputChange();
        }
    }

    removeWord(word: Word) {
        const delimiter = this.delimiter.getRawValue();
        const lines = this.content.split("\n");
        const line = word.question + delimiter + word.phonetic + delimiter + word.correct;
        this.content = "";
        lines.forEach( (l) => {
            if(l != line && l != "") {
                this.content += l + "\n";
            }
        })
        this.onInputChange();
    }

    adaptURLText() {
        const name = this.name.getRawValue();
        let urlString = "";

        let limit = 16;
        if(name.length <= 16) {
            limit = name.length;
        }
        for(let i = 0; i < limit; i++) {
            const symbol = this.removeDiacritics(name.charAt(i));
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
        this.url.setValue(this.removeDiacritics(urlString).toLowerCase());
    }

    onFirstInputChange() {
        const nameLength = this.name.getRawValue().length;
        // we need to refresh the URL string if name was changed
        if(this.lastNameLength != nameLength) {
            this.adaptURLText();
        }

        this.lastNameLength = nameLength;
        if(this.name.getRawValue().length == 0) {
            this.firstFeedback = "Please enter a name.";
            return;
        }

        if(this.url.getRawValue().length == 0) {
            this.firstFeedback = "The URL is empty.";
            return;
        }

        if(this.firstLanguage.getRawValue() == this.secondLanguage.getRawValue()) {
            this.firstFeedback = "The languages must be different.";
            return;
        }
        this.firstFeedback = "Click continue when ready.";
    }

    onFilterChange() {
        const filter = this.removeDiacritics(this.filter.getRawValue());
        if(filter.length != 0) {
            this.filteredRelevantWords = new Set<Word>();
            this.relevantWords.forEach((word) => {
                const correct = this.removeDiacritics(word.correct);
                const phonetic = this.removeDiacritics(word.phonetic);
                const question = this.removeDiacritics(word.question);
                if(correct.includes(filter) || phonetic.includes(filter) || question.includes(filter)) {
                    this.filteredRelevantWords.add(word);
                }
            });
            return;
        }
        this.filteredRelevantWords = this.relevantWords;
    }

    isFirstInputValid() {
        return this.name.getRawValue().length != 0 &&
            this.url.getRawValue().length != 0 &&
            this.firstLanguage.getRawValue() != this.secondLanguage.getRawValue();
    }

    removeDiacritics(inputString: string) {
        return inputString.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    randomizeLanguages() {
        const keys = Object.keys(FLAGS);
        const firstIndex = Math.floor(Math.random() * keys.length);
        let secondIndex = Math.floor(Math.random() * keys.length);
        if(firstIndex == secondIndex) {
            secondIndex = (secondIndex + 1) % keys.length;
        }
        this.firstLanguage.setValue(keys[firstIndex]);
        this.secondLanguage.setValue(keys[secondIndex]);
        this.firstLanguage.setValue(this.firstLanguage.getRawValue());
        console.log(keys[firstIndex]);
    }

    onInputChange() {
        this.adaptURLText();
        this.words = new Set<Word>();
        this.counter = 0;
        const lines = (this.content + "\n").split("\n");
        const delimiter = this.delimiter.getRawValue();

        if(this.content.length != 0) {
            for(let i = 0; i < lines.length - 1; i++) {
                const line = lines[i];
                const word = new Word(0,0,  line.split(delimiter)[0],
                    line.split(delimiter)[1], line.split(delimiter)[2], []);

                if(this.isValidLine(lines[i]) && word.question.length != 0 && word.correct.length != 0) {
                    if(!this.containsWord(this.words, word)) {
                        this.words.add(word);
                        this.counter++;
                    }
                }
            }
        }
    }

    containsWord(words: Set<Word>, word: Word) {
        let contains = false;
        words.forEach( (current) => {
            if(current.question == word.question && current.correct == word.correct && current.phonetic == word.phonetic) {
                contains = true;
            }
        })
        return contains;
    }

    protected readonly FLAGS = FLAGS;
}
