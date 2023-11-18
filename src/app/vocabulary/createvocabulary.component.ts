import {Component} from '@angular/core';
import {Form, FormControl} from "@angular/forms";
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
    feedback:string = "Please choose a delimeter.";
    words: Set<Word> = new Set<Word>();
    counter: number = 0;
    debug: string = "";
    languageString: string = "";
    languages: string[] = [];
    name: FormControl<string> = new FormControl("") as FormControl<string>;
    description : FormControl<string> = new FormControl("") as FormControl<string>;
    firstLanguage: FormControl<string> = new FormControl("") as FormControl<string>;
    secondLanguage: FormControl<string> = new FormControl("") as FormControl<string>;

    constructor(private http: HttpClient, private router: Router) { }

    ngOnInit(){
        if(sessionStorage.getItem("sessionId") == null){
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

    onSend(){
        if(this.counter != 0){
            let sentString: string = "";
            this.words.forEach(function(w) {
                sentString += w.question + "," + w.phonetic + "," + w.correct + "\n";
            });
            this.debug = sentString;
            let username = localStorage.getItem("username");
            const json = {
                "session_id": sessionStorage.getItem("sessionId"),
                "name": this.name.getRawValue(),
                "description": this.description.getRawValue(),
                "first_language": this.firstLanguage.getRawValue(),
                "second_language": this.secondLanguage.getRawValue(),
                "vocabulary": this.vocab.getRawValue()
            }

            fetch("http://localhost:8000/api/createvocab", {
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

    onInputChange(){
        this.words = new Set<Word>();
        this.lines = this.content.split("\n");
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

    protected readonly oninput = oninput;
}
