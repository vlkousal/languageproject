import {Component} from '@angular/core';
import {FormControl} from "@angular/forms";
import {BACKEND, Word} from "../constants";

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
    counter: number = 0;
    languages: string[] = [];
    name: FormControl<string> = new FormControl("") as FormControl<string>;
    description : FormControl<string> = new FormControl("") as FormControl<string>;
    url: FormControl<string> = new FormControl("") as FormControl<string>;
    firstLanguage: FormControl<string> = new FormControl("Czech") as FormControl<string>;
    secondLanguage: FormControl<string> = new FormControl("Czech") as FormControl<string>;
    firstPart: boolean = true;
    lastNameLength: number = 0;
    relevantWords: Set<Word> = new Set<Word>();
    filter: FormControl<string> = new FormControl("") as FormControl<string>;
    filteredRelevantWords: Set<Word> = new Set<Word>();

    ngOnInit(){
        this.getLanguageJson().then((result: string) => {
            this.setupDropdownMenus(result);
        }).catch((error) => {
            console.error('Error:', error);
        });
    }

    setupDropdownMenus(jsonString: string){
        const json = JSON.parse(jsonString);
        this.languages = Object.keys(json);
    }

    onFileSelected(event: any){
        const selectedFile = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e: any) => {
            this.content = e.target.result;
            this.onInputChange();
        };
        reader.readAsText(selectedFile);
    }

    goBack(){
        this.firstPart = true;
    }

    async onContinue(){
        if(this.isFirstInputValid()){
            this.relevantWords = new Set<Word>();
            this.firstPart = false;
            let parsed = JSON.parse(await this.getRelevantVocabulary());
            for(let i = 0; i < parsed.words.length; i++){
                let word = new Word(0,0,  parsed.words[i].first, parsed.words[i].phonetic, parsed.words[i].second, []);
                if(!this.containsWord(this.relevantWords, word)){
                    this.relevantWords.add(word);
                }
            }
            this.filteredRelevantWords = this.relevantWords;
        }
    }

    onSend(){
        if(this.counter >= 3){
            let sentString: string = "";
            this.words.forEach(function(w) {
                sentString += w.question + "," + w.phonetic + "," + w.correct + "\n";
            });
            const json = {
                "session_id": localStorage.getItem("sessionId"),
                "name": this.name.getRawValue(),
                "description": this.description.getRawValue(),
                "url": this.url.getRawValue(),
                "first_language": this.firstLanguage.getRawValue(),
                "second_language": this.secondLanguage.getRawValue(),
                "vocabulary": this.vocab.getRawValue()
            }

            fetch(BACKEND + "api/createvocab/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(json),
            })
        }
    }

    isValidLine(line: string){
        let splitLine: string[] = line.split(this.delimiter.getRawValue());
        return splitLine.length == 3;
    }

    addWord(word: Word) {
        if(!this.containsWord(this.words, word)){
            let delimeter = this.delimiter.getRawValue();
            if(this.content.charAt(this.content.length - 1) != "\n" && this.content.charAt(this.content.length - 1) != ""){
                this.content += "\n";
            }
            this.content += word.question + delimeter + word.phonetic + delimeter + word.correct + "\n";
            this.onInputChange();
        }
    }

    removeWord(word: Word){
        let delimiter = this.delimiter.getRawValue();
        let lines = this.content.split("\n");
        let line = word.question + delimiter + word.phonetic + delimiter + word.correct;
        this.content = "";
        lines.forEach( (l) => {
            if(l != line && l != ""){
                this.content += l + "\n";
            }
        })
        this.onInputChange();
    }

    adaptURLText(){
        let name = this.name.getRawValue();
        let urlString = "";

        let limit = 16;
        if(name.length <= 16){
            limit = name.length;
        }
        for(let i = 0; i < limit; i++){
            let symbol = this.removeDiacritics(name.charAt(i));
            let alphanumericRegex = /^[-_a-zA-Z0-9]$/;
            if(alphanumericRegex.test(symbol)){
                urlString += symbol;
            } else if(symbol == " " && urlString.charAt(urlString.length - 1) != "-"){
                urlString += "-";
            }
        }
        while(urlString.charAt(urlString.length - 1) == "-"){
            urlString = urlString.slice(0, -1);
        }
        this.url.setValue(this.removeDiacritics(urlString).toLowerCase());
    }

    onFirstInputChange() {
        let nameLength = this.name.getRawValue().length;
        // we need to refresh the URL string if name was changed
        if(this.lastNameLength != nameLength){
            this.adaptURLText();
        }

        this.lastNameLength = nameLength;
        if(this.name.getRawValue().length == 0){
            this.firstFeedback = "Please enter a name.";
            return;
        }

        if(this.url.getRawValue().length == 0){
            this.firstFeedback = "The URL is empty.";
            return;
        }

        if(this.firstLanguage.getRawValue() == this.secondLanguage.getRawValue()){
            this.firstFeedback = "The languages must be different.";
            return;
        }
        this.firstFeedback = "Click continue when ready.";
    }

    onFilterChange(){
        let filter = this.removeDiacritics(this.filter.getRawValue());
        if(filter.length != 0){
            this.filteredRelevantWords = new Set<Word>();
            this.relevantWords.forEach((word) => {
                let correct = this.removeDiacritics(word.correct);
                let phonetic = this.removeDiacritics(word.phonetic);
                let question = this.removeDiacritics(word.question);
                if(correct.includes(filter) || phonetic.includes(filter) || question.includes(filter)) {
                    this.filteredRelevantWords.add(word);
                }
            });
            return;
        }
        this.filteredRelevantWords = this.relevantWords;
    }

    isFirstInputValid(){
        return this.name.getRawValue().length != 0 &&
            this.url.getRawValue().length != 0 &&
            this.firstLanguage.getRawValue() != this.secondLanguage.getRawValue();
    }

    removeDiacritics(inputString: string) {
        return inputString.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    onInputChange(){
        this.adaptURLText();
        this.words = new Set<Word>();
        this.counter = 0;
        let lines = (this.content + "\n").split("\n");
        let delimiter = this.delimiter.getRawValue();

        if(this.content.length != 0){
            for(let i = 0; i < lines.length - 1; i++){
                let line = lines[i];
                let word = new Word(0,0,  line.split(delimiter)[0],
                    line.split(delimiter)[1], line.split(delimiter)[2], []);

                if(this.isValidLine(lines[i]) && word.question.length != 0 && word.correct.length != 0){
                    if(!this.containsWord(this.words, word)) {
                        this.words.add(word);
                        this.counter++;
                    }
                }
            }
        }
    }

    containsWord(words: Set<Word>, word: Word){
        let contains = false;
        words.forEach( (current) => {
            if(current.question == word.question && current.correct == word.correct && current.phonetic == word.phonetic){
                contains = true;
            }
        })
        return contains;
    }

    async getLanguageJson(): Promise<string> {
        try {
            const response = await fetch(BACKEND + 'api/get_languages/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                return await response.text();
            }
            throw new Error('Network response was not ok.');
        } catch (error) {
            console.error('Error:', error);
            throw error; // Re-throw the error for further handling
        }
    }

    async getRelevantVocabulary(): Promise<string> {
        try {
            const response = await fetch(BACKEND + "api/getlanguagevocab/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }, body: JSON.stringify({
                    "first_language": this.firstLanguage.getRawValue(),
                    "second_language": this.secondLanguage.getRawValue()
                })
            });

            if(response.ok){
                return await response.text();
            }
            throw new Error("XD ROFL LMAO");
        } catch(error){
            console.error("Error:", error);
            throw error;
        }
    }
}
