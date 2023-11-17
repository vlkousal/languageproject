import { Component } from '@angular/core';
import {FormControl} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import { Router } from '@angular/router';
import {Word} from "../constants";
@Component({
  selector: 'app-login',
  templateUrl: './createvocabulary.component.html',
  styleUrls: ['./createvocabulary.component.css']
})
export class CreateVocabularyComponent {
  constructor(private http: HttpClient, private router: Router) { }
  vocab = new FormControl("") as FormControl<string>;
  delimiter = new FormControl("") as FormControl<string>;
  content: string = "";
  lines: string[] = [];
  feedback:string = "Please choose a delimeter.";
  words: Set<Word> = new Set<Word>();
  counter: number = 0;
  debug: string = "";
  name: FormControl<string> = new FormControl("") as FormControl<string>;
  description : FormControl<string> = new FormControl("") as FormControl<string>;

  ngOnInit(){
    if(sessionStorage.getItem("sessionId") == null){
      this.router.navigate(["/"]);
    }
  }

  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const fileContent = e.target.result;
      this.content = fileContent;
      this.onInputChange();
    };
    reader.readAsText(selectedFile);
  }

  onSend() : void{
    if(this.counter != 0){
      let sentString: string = "";
      this.words.forEach(function(w) {
        sentString += w.question + "," + w.phonetic + "," + w.correct + "\n";
      });
      this.debug = sentString;
    }
  }

  isValidLine(line: string) :boolean{
    let splitLine: string[] = line.split(this.delimiter.getRawValue());
    return splitLine.length == 3;
  }

  onInputChange():void{
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
  protected readonly oninput = oninput;
}
