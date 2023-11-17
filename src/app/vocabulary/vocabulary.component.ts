import { Component } from '@angular/core';
import {hsk3, MAX_HEALTH, STREAK_FOR_HEALTH, Word} from "../constants";

@Component({
  selector: 'app-vocabulary',
  templateUrl: './vocabulary.component.html',
  styleUrls: ['./vocabulary.component.css']
})

export class VocabularyComponent {
  title = 'homes';
  words: Word[] = getWords();
  index: number = 0;
  current: Word = this.words[this.index];
  wrong: Word[] = [];
  score: number = 0;
  streak: number = 0;
  lives: number = 3;
  hidden: boolean = false;
  correctAnswers: number = 0;
  feedback: string = "";

  speak(text: string){
    let utt: SpeechSynthesisUtterance = new SpeechSynthesisUtterance();
    // MAC - (zh-CN)
    utt.lang = "zh-CN";
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

  restart(): void{
    this.index = 0;
    this.score = 0;
    this.streak = 0;
    this.lives = 3;
    this.correctAnswers = 0;
    this.hidden = false;
    this.words = getWords();
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

function getWords() : Word[]{
  let vocabString = getVocabulary();
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
  }
  words = shuffleList(words);
  return words;
}

function getVocabulary(){
  return hsk3.split("\n");
}

