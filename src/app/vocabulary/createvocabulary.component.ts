import {Component} from '@angular/core';
import {FormControl} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router} from '@angular/router';
import {Word} from "../constants";

@Component({
  selector: 'app-login',
  templateUrl: './createvocabulary.component.html',
  styleUrls: ['./createvocabulary.component.css']
})
export class CreateVocabularyComponent {

    vocab = new FormControl("") as FormControl<string>;
    delimiter = new FormControl("") as FormControl<string>;
    content: string = "";
    lines: string[] = [];
    firstFeedback: string = "Please enter a name.";
    feedback: string = "Please choose a delimeter.";
    words: Set<Word> = new Set<Word>();
    counter: number = 0;
    debug: string = "";
    languageString: string = "";
    languages: string[] = [];
    name: FormControl<string> = new FormControl("") as FormControl<string>;
    description : FormControl<string> = new FormControl("") as FormControl<string>;
    url: FormControl<string> = new FormControl("") as FormControl<string>;
    firstLanguage: FormControl<string> = new FormControl("Czech") as FormControl<string>;
    secondLanguage: FormControl<string> = new FormControl("Czech") as FormControl<string>;
    firstPart: boolean = true;
    lastNameLength: number = 0;
    relevantWords: Word[] = [];

    constructor(private http: HttpClient, private router: Router) { }

    ngOnInit(){
        if(localStorage.getItem("sessionId") == null){
            this.router.navigate(["/"]);
        }
        this.getLanguageJson().then((result: string) => {
            this.languageString = result;
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
            this.firstPart = false;
            let parsed = await JSON.parse(await this.getRelevantVocabulary());
            this.relevantWords = [];
            let nevim: string[] = parsed.words;
            for(let i = 0; i < nevim.length; i++){
                let word = parsed.words[i];
                this.relevantWords.push(new Word(word.first, word.phonetic, word.second, []));
            }
            console.log(this.relevantWords.length);
        }
    }

    onSend(){
        if(this.counter != 0){
            let sentString: string = "";
            this.words.forEach(function(w) {
                sentString += w.question + "," + w.phonetic + "," + w.correct + "\n";
            });
            this.debug = sentString;
            const json = {
                "session_id": localStorage.getItem("sessionId"),
                "name": this.name.getRawValue(),
                "description": this.description.getRawValue(),
                "url": this.url.getRawValue(),
                "first_language": this.firstLanguage.getRawValue(),
                "second_language": this.secondLanguage.getRawValue(),
                "vocabulary": this.vocab.getRawValue()
            }

            fetch("http://localhost:8000/api/createvocab/", {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify(json),
            })
        }
    }

    isValidLine(line: string){
        let splitLine: string[] = line.split(this.delimiter.getRawValue());
        return splitLine.length == 3;
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
        this.lines = (this.content + "\n").split("\n");
        if(this.delimiter.getRawValue().length == 0){
            this.feedback = "Please choose a delimeter.";
            return;
        }

        if(this.content.length != 0){
            for(let i = 0; i < this.lines.length - 1; i++){
                let first = this.lines[i].split(this.delimiter.getRawValue())[0];
                let phonetic: string = this.lines[i].split(this.delimiter.getRawValue())[1];
                let second: string = this.lines[i].split(this.delimiter.getRawValue())[2];

                if(!this.isValidLine(this.lines[i])){
                    this.feedback = "Line number " + (i + 1) + " is not valid.";
                    return;
                }

                if(first.length == 0 || second.length == 0){
                    this.feedback = "The first and the third parameters are mandatory.";
                    return;
                }
                let word = new Word(first, phonetic, second, []);
                this.words.add(word);
                this.counter = this.words.size;
            }
        }
        if(this.words.size < 2){
            this.feedback = "At least two words are required.";
            return;
        }
    }

    async getLanguageJson(): Promise<string> {
        try {
            const response = await fetch('http://localhost:8000/api/get_languages/', {
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
            const response = await fetch("http://localhost:8000/api/getlanguagevocab/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }, body: JSON.stringify({
                    "first_language": this.firstLanguage.getRawValue(),
                    "second_language": this.secondLanguage.getRawValue()
                })
            });

            if(response.ok){
                let text = await response.text();
                return text;
            }
            throw new Error("XD ROFL LMAO");
        } catch(error){
            console.error("Error:", error);
            throw error;
        }
    }
}
