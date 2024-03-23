import { Component } from '@angular/core';
import {BACKEND, MAX_HEALTH, STREAK_FOR_HEALTH, Word} from "../constants";
import {ActivatedRoute} from "@angular/router";
import {ApiTools} from "../apitools";
import {VocabUtils} from "../vocabutils";
import {first} from "rxjs";
import {FormControl} from "@angular/forms";

@Component({
    selector: 'app-vocabulary',
    templateUrl: './vocabulary.component.html',
    styleUrls: ['./vocabulary.component.css']
})

export class VocabularyComponent {

    words: Word[] = [];
    all: Word[] = [];
    index: number = 0;
    current: Word = new Word(0, 0, "", "", "", [""]);
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
    secondLanguage: string = "";
    languageNames: string[] = [];

    utt: SpeechSynthesisUtterance = new SpeechSynthesisUtterance();
    selectedFirstLanguageName: FormControl<string> = new FormControl("") as FormControl<string>;
    selectedSecondLanguageName: FormControl<string> = new FormControl("") as FormControl<string>;
    firstLang: string = "";
    secondLang: string = "";

    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.url = params['vocabUrl'];
        });
        this.setup();

        let voices = speechSynthesis.getVoices();
        voices.forEach((voice, i) => {
            this.languageNames.push(voice.name);
        });
        this.languageNames.sort();
    }

    testSecondVoice() {
        let randomWord = getRandomElement(this.words);
        let secondVoice = this.getVoiceByName(this.selectedSecondLanguageName.getRawValue());
        this.utt.lang = this.secondLang;
        if(secondVoice != null){
            this.utt.voice = secondVoice;
        }
        this.speak(randomWord.correct);
    }

    testFirstVoice() {
        let randomWord = getRandomElement(this.words);
        let firstVoice = this.getVoiceByName(this.selectedFirstLanguageName.getRawValue());
        this.utt.lang = this.firstLang;
        if (firstVoice != null){
            this.utt.voice = firstVoice;
        }
        this.speak(randomWord.question);
    }

    getVoiceByName(name: string) {
        return speechSynthesis.getVoices().find(voice => voice.name === name);
    }

    onFirstLanguageChange(){
        let voice = this.getVoiceByName(this.selectedFirstLanguageName.getRawValue());
        if (voice) {
            this.utt.voice = voice;
            this.utt.lang = voice.lang;
            this.firstLang = voice.lang;
        }
        localStorage.setItem(this.firstLanguage, this.selectedFirstLanguageName.getRawValue());
    }

    onSecondLanguageChange() {
        let voice = this.getVoiceByName(this.selectedSecondLanguageName.getRawValue());
        if (voice) {
            this.utt.voice = voice;
            this.utt.lang = voice.lang;
            this.secondLang = voice.lang;
        }
        localStorage.setItem(this.secondLanguage, this.selectedSecondLanguageName.getRawValue());
    }

    async setup() {
        this.vocabularySet = await ApiTools.getVocabJson(this.url)
        let json = JSON.parse(this.vocabularySet);
        this.name = json.name;
        this.contributor = json.author;
        this.description = json.description;
        this.firstLanguage = json.first_language_flag + " " + json.first_language;
        this.secondLanguage = json.second_language_flag + " " + json.second_language;
        this.loadVocab();
        VocabUtils.sortByFirst(this.words);
        this.VocabUtils.sortByFirst(this.words);

        let firstName = localStorage.getItem(this.firstLanguage);
        if(firstName != null){
            this.selectedFirstLanguageName.setValue(firstName);
            this.onFirstLanguageChange();
            let voice = this.getVoiceByName(this.selectedFirstLanguageName.getRawValue());
            if (voice) {
                this.utt.voice = voice;
                this.utt.lang = voice.lang;
                this.firstLang = voice.lang;
            }
        }

        let secondName = localStorage.getItem(this.secondLanguage);
        if(secondName != null){
            this.selectedSecondLanguageName.setValue(secondName);
            this.onSecondLanguageChange();

            let voice = this.getVoiceByName(this.selectedSecondLanguageName.getRawValue());
            if (voice) {
                this.utt.voice = voice;
                this.utt.lang = voice.lang;
                this.secondLang = voice.lang;
            }
        }
    }


    speak(text: string) {
        if(this.utt.voice != null){
            console.log(this.utt.lang, this.utt.voice.name);
        }
        this.utt.text = text;
        window.speechSynthesis.speak(this.utt);
    }

    evalCorrect(): void {
        this.streak++;
        if(this.streak % STREAK_FOR_HEALTH == 0 && this.lives < MAX_HEALTH){
            this.lives++;
        }
        this.score += this.streak;
        this.correctAnswers++;
    }

    evalWrong(): void {
        this.streak = 0;
        this.lives--;
        this.wrong.push(this.current);
        if(this.lives == 0) {
            this.hidden = true;
            return;
        }
    }

    loadVocab() {
        let parsed = JSON.parse(this.vocabularySet).vocabulary;
        let vocabString = shuffleList(parsed.split("\n")).filter(str => str.trim() !== '');
        let words: Word[] = [];

        for(let i = 0; i < vocabString.length; i++) {
            let correct: string = vocabString[i].split(";")[2];
            let answers: string[] = [correct];
            for(let answer = 0; answer < 2; answer++) {
                let index = getIndex(i, vocabString.length);
                let otherAnswer: string = vocabString[index].split(";")[2];
                answers.push(otherAnswer);
            }
            answers = shuffleList(answers);
            let id = vocabString[i].split(";")[3];
            let success_rate = parseInt(vocabString[i].split(";")[4]);
            let question = vocabString[i].split(";")[0];
            let phonetic: string = vocabString[i].split(";")[1];
            let word = new Word(id, success_rate, question, phonetic, correct, answers);
            words.push(word);
            this.words = words;
            this.all = words;
        }
    }

    startVocab() {
        this.loadVocab();
        shuffleList(this.words);
        // we sort, and then we move the "undiscovered" words to be first
        let to_move_index = 0;
        for(let i = 0; i < this.words.length; i++){
            let word = this.words[i];
            if(word.success_rate == -1){
                let temp = this.words[to_move_index];
                this.words[to_move_index] = word;
                this.words[i] = temp
                to_move_index++;
            }
        }
        this.restart();
        this.hiddenPreview = true;
    }

    checkAnswer(answer: string): void {
        window.speechSynthesis.cancel();
        if(this.current.correct == answer) {
            this.sendResult(true);
            this.evalCorrect();
            this.feedback = "Correct!";
        } else {
            this.sendResult(false);
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

    sendResult(correct: boolean){
        const data = {
            "token": localStorage.getItem("sessionId"),
            "wordId": this.current.id,
            "correct": correct
        }

        fetch(BACKEND + "api/addresult/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
    }

    replayMistakes(): void {
        if(this.wrong.length > 0){
            this.words = this.wrong;
            this.restart();
        }
    }

    replay(): void {
        this.words = this.all;
        this.restart();
    }

    restart(): void {
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
    protected readonly VocabUtils = VocabUtils;
    protected readonly first = first;
}

function getIndex(blocked: number, ceil: number): number {
    let index = Math.floor(Math.random() * ceil);
    while(index == blocked) {
        index = Math.floor(Math.random() * ceil);
    }
    return index;
}

function shuffleList(list: any[]) {
    for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
    }
    // we sort, and then we move the "undiscovered" words to be first
    let to_move_index = 0;
    for(let i = 0; i < list.length; i++){
      let word = list[i];
    if(word.success_rate == -1){
      let temp = list[to_move_index];
      list[to_move_index] = word;
      list[i] = temp
      to_move_index++;
    }
  }
    return list;
}

function getRandomElement(list: any[]) {
    // Generate a random index within the range of the list's length
    const randomIndex = Math.floor(Math.random() * list.length);
    // Return the element at the random index
    return list[randomIndex];
}