import { Component } from '@angular/core';
import {hsk3, MAX_HEALTH, STREAK_FOR_HEALTH, Word} from "../constants";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-vocabulary',
  templateUrl: './vocabulary.component.html',
  styleUrls: ['./vocabulary.component.css']
})

export class VocabularyComponent {
  words: Word[] = [];
  all: Word[] = [];
  index: number = 0;
  current: Word = new Word("nothing", "test", "test", ["test"]);
  wrong: Word[] = [];
  score: number = 0;
  streak: number = 0;
  lives: number = 3;
  hidden: boolean = true;
  hiddenPreview: boolean = false;
  correctAnswers: number = 0;
  feedback: string = "";
  url: string = "";
  vocabularySet: string = "";
  name: string = "";
  description: string = "";
  contributor: string = "";
  firstLanguage: string = "";
  firstFlag: string = "";
  secondLanguage: string = "";
  secondFlag: string = "";

  constructor(private route: ActivatedRoute) {}

  ngOnInit(){
    this.route.params.subscribe(params => {
      this.url = params['vocabUrl'];
    });
    this.setup();
  }

  async setup(){
    this.vocabularySet = await this.getVocabJson();
    let json = JSON.parse(this.vocabularySet);
    this.name = json.name;
    this.contributor = json.author;
    this.description = json.description;
    this.firstLanguage = json.first_language;
    this.secondLanguage = json.second_language;
    this.firstFlag = json.first_language_flag;
    this.secondFlag = json.second_language_flag;
  }


  async getVocabJson(): Promise<string> {
    try {
      const response = await fetch('http://localhost:8000/api/getvocab/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({"url": this.url})
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

  speak(text: string){
    let utt: SpeechSynthesisUtterance = new SpeechSynthesisUtterance();
    // MAC - (zh-CN), LINUX - (cmn)
    utt.lang = "cmn";
    utt.text = text;
    window.speechSynthesis.speak(utt);
  }

  evalCorrect(): void{
    this.streak++;
    if(this.streak % STREAK_FOR_HEALTH == 0 && this.lives < MAX_HEALTH){
      this.lives++;
    }
    this.score += this.streak;
    this.correctAnswers++;
  }

  evalWrong(): void{
    this.streak = 0;
    this.lives--;
    this.wrong.push(this.current);
    if(this.lives == 0){
      this.hidden = true;
      return;
    }
  }

  startVocab() {
    let parsed = JSON.parse(this.vocabularySet).vocabulary;
    let vocabString = shuffleList(parsed.split("\n")).filter(str => str.trim() !== '');
    console.log(vocabString);
    let words: Word[] = [];
    for(let i = 0; i < vocabString.length; i++){
      let correct: string = vocabString[i].split(";")[2];
      let answers: string[] = [correct];
      for(let j = 0; j < 2; j++){
        let index = getIndex(i, vocabString.length);
        let otherAnswer: string = vocabString[index].split(";")[2];
        answers.push(otherAnswer);
      }
      answers = shuffleList(answers);
      let question = vocabString[i].split(";")[0];
      let phonetic: string = vocabString[i].split(";")[1];
      let word = new Word(question, phonetic, correct, answers);
      words.push(word);
      this.words = words;
      this.all = words;
    }
    words = shuffleList(words);
    this.restart();
    this.hiddenPreview = true;
  }

  checkAnswer(answer: string): void{
    window.speechSynthesis.cancel();
    if(this.current.correct == answer){
      this.evalCorrect();
      this.feedback = "Correct!";
    } else{
      this.evalWrong();
      this.feedback = "The correct answer was " + this.current.correct;
    }
    this.index++;
    if(this.index == this.words.length) {
      this.hidden = true;
      return;
    }
    this.current = this.words[this.index];
    this.speak(this.current.question);
  }

  replayMistakes(): void{
    if(this.wrong.length > 0){
      this.words = this.wrong;
      this.restart();
    }
  }

  replay(): void{
    this.words = this.all;
    this.restart();
  }

  restart(): void{
    this.index = 0;
    this.score = 0;
    this.streak = 0;
    this.lives = 3;
    this.correctAnswers = 0;
    this.hidden = false;
    this.words = shuffleList(this.words);
    this.wrong = [];
    this.current = this.words[this.index];
    this.speak(this.current.question);
  }

  protected readonly Math = Math;
}

function getIndex(blocked: number, ceil: number): number{
  let index = Math.floor(Math.random() * ceil);
  while(index == blocked){
    index = Math.floor(Math.random() * ceil);
  }
  return index;
}

function shuffleList(list: any[]) {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

function getVocabulary(this: any){
  return hsk3.split("\n");
}

