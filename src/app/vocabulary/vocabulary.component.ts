import { Component } from '@angular/core';
import {hsk3, MAX_HEALTH, STREAK_FOR_HEALTH, Word} from "../constants";

@Component({
  selector: 'app-vocabulary',
  templateUrl: './vocabulary.component.html',
  styleUrls: ['./vocabulary.component.css']
})
export class VocabularyComponent {
  title = 'homes';
  words = getRandom10();
  index: number = 0;
  current: Word = this.words[this.index];
  wrong: Word[] = [];
  score: number = 0;
  streak: number = 0;
  lives: number = 3;
  hidden: boolean = false;
  correctAnswers: number = 0;
  debug = [];
  speak(text: string){
    let utt: SpeechSynthesisUtterance = new SpeechSynthesisUtterance();
    utt.lang = "cmn";
    utt.text = text;
    utt.volume = 0;
    window.speechSynthesis.speak(utt);
  }
  checkAnswer(answer: string): void{
    window.speechSynthesis.cancel();
    if(this.current.correct == answer){
      this.streak++;
      if(this.streak % STREAK_FOR_HEALTH == 0 && this.lives < MAX_HEALTH){
        this.lives++;
      }
      this.score += this.streak;
      this.correctAnswers++;
    } else{
      this.streak = 0;
      this.lives--;
      this.wrong.push(this.current);
      if(this.lives == 0){
        this.hidden = true;
        return;
      }
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
    this.words = getRandom10();
    this.wrong = [];
    this.current = this.words[this.index];
    this.speak(this.current.question);
  }

  protected readonly Math = Math;
}

function getRandom10(){
  let used = new Set<number>;
  let vocabulary = getVocabulary();
  let words = [];
  while(words.length != vocabulary.length){
    let index = Math.floor(Math.random() * vocabulary.length);
    if(!used.has(index)){
      let answerIndexes: number[] = [];
      while(answerIndexes.length != 3){
        let answerIndex = Math.floor(Math.random() * vocabulary.length);
        if(answerIndex != index && !answerIndexes.includes(answerIndex)){
          answerIndexes.push(answerIndex);
        }
      }
      let randomAnswer: number = Math.floor(Math.random() * 3);
      answerIndexes[randomAnswer] = index;
      let question = vocabulary[index].split(";")[0];
      let phonetic: string = vocabulary[index].split(";")[1];
      let correct: string = vocabulary[index].split(";")[2];
      let answer1 = vocabulary[answerIndexes[0]].split(";")[2];
      let answer2 = vocabulary[answerIndexes[1]].split(";")[2];
      let answer3 = vocabulary[answerIndexes[2]].split(";")[2];
      let word = new Word(question, phonetic, correct, answer1, answer2, answer3);
      words.push(word);
      used.add(index);
    }
  }
  return words;
}
function getVocabulary(){
  return hsk3.split("\n");
}

