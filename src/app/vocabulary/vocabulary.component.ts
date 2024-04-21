import { Component } from '@angular/core';
import {BACKEND, MAX_HEALTH, STREAK_FOR_HEALTH, Word} from "../constants";
import {ActivatedRoute} from "@angular/router";
import {ApiTools} from "../apitools";
import {VocabUtils} from "../vocabutils";
import {first} from "rxjs";
import {FormControl} from "@angular/forms";
import {Drawing} from "../drawinglogic";

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
    currentIndex: number = -1;
    wrong: Word[] = [];
    score: number = 0;
    streak: number = 0;
    lives: number = 3;
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

    writtenAnswer: FormControl<string> = new FormControl("") as FormControl<string>;

    hideChooseOfThree: boolean = true;
    hidePreview: boolean = false;
    hideWriteTheAnswer: boolean = true;
    hideEnd: boolean = true;
    hideFlashcards: boolean = true;
    hideDrawing: boolean = true;

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

        const voices = speechSynthesis.getVoices();
        voices.forEach((voice) => {
            this.languageNames.push(voice.name);
        });
        this.languageNames.sort();
        Drawing.prepCanvas();
    }

    repeatWord(){
        // TODO "flipped words"...
        this.utt.lang = this.firstLang;
        const firstVoice = this.getVoiceByName(this.selectedFirstLanguageName.getRawValue());
        if(firstVoice){
            this.utt.voice = firstVoice;
        }
        this.speak(this.current.question);
    }

    hideEverything(){
        this.hidePreview = true;
        this.hideWriteTheAnswer = true;
        this.hideChooseOfThree = true;
        this.hideEnd = true;
    }

    testSecondVoice() {
        const randomWord = getRandomElement(this.words);
        const secondVoice = this.getVoiceByName(this.selectedSecondLanguageName.getRawValue());
        this.utt.lang = this.secondLang;
        if(secondVoice != null){
            this.utt.voice = secondVoice;
        }
        this.speak(randomWord.correct);
    }

    testFirstVoice() {
        const randomWord = getRandomElement(this.words);
        const firstVoice = this.getVoiceByName(this.selectedFirstLanguageName.getRawValue());
        this.utt.lang = this.firstLang;
        if (firstVoice != null){
            this.utt.voice = firstVoice;
        }
        this.speak(randomWord.question);
    }

    nextFlashcard() {
        this.current = this.words[(++this.currentIndex) % this.words.length];
        this.utt.lang = this.firstLang;
        const firstVoice = this.getVoiceByName(this.selectedFirstLanguageName.getRawValue());
        if (firstVoice != null){
            this.utt.voice = firstVoice;
        }
        this.speak(this.current.question);
    }

    prevFlashcard() {
        this.current = this.words[(--this.currentIndex) % this.words.length];
        this.utt.lang = this.firstLang;
        const firstVoice = this.getVoiceByName(this.selectedFirstLanguageName.getRawValue());
        if (firstVoice != null){
            this.utt.voice = firstVoice;
        }
        this.speak(this.current.question);
    }

    getVoiceByName(name: string) {
        return speechSynthesis.getVoices().find(voice => voice.name === name);
    }

    onFirstLanguageChange() {
        const voice = this.getVoiceByName(this.selectedFirstLanguageName.getRawValue());
        if (voice) {
            this.utt.voice = voice;
            this.utt.lang = voice.lang;
            this.firstLang = voice.lang;
        }
        localStorage.setItem(this.firstLanguage, this.selectedFirstLanguageName.getRawValue());
    }

    onSecondLanguageChange() {
        const voice = this.getVoiceByName(this.selectedSecondLanguageName.getRawValue());
        if (voice) {
            this.utt.voice = voice;
            this.utt.lang = voice.lang;
            this.secondLang = voice.lang;
        }
        localStorage.setItem(this.secondLanguage, this.selectedSecondLanguageName.getRawValue());
    }

    async setup() {
        this.vocabularySet = await ApiTools.getVocabJson(this.url)
        const json = JSON.parse(this.vocabularySet);
        this.name = json.name;
        this.contributor = json.author;
        this.description = json.description;
        this.firstLanguage = json.first_language_flag + " " + json.first_language;
        this.secondLanguage = json.second_language_flag + " " + json.second_language;
        this.loadVocab();
        VocabUtils.sortByFirst(this.words);
        this.VocabUtils.sortByFirst(this.words);

        const firstName = localStorage.getItem(this.firstLanguage);
        if(firstName != null){
            this.selectedFirstLanguageName.setValue(firstName);
            this.onFirstLanguageChange();
            const voice = this.getVoiceByName(this.selectedFirstLanguageName.getRawValue());
            if (voice) {
                this.utt.voice = voice;
                this.utt.lang = voice.lang;
                this.firstLang = voice.lang;
            }
        }

        const secondName = localStorage.getItem(this.secondLanguage);
        if(secondName != null){
            this.selectedSecondLanguageName.setValue(secondName);
            this.onSecondLanguageChange();

            const voice = this.getVoiceByName(this.selectedSecondLanguageName.getRawValue());
            if (voice) {
                this.utt.voice = voice;
                this.utt.lang = voice.lang;
                this.secondLang = voice.lang;
            }
        }
    }


    speak(text: string) {
        this.utt.text = text;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(this.utt);
    }

    evalCorrect(): void {
        this.streak++;
        if(this.streak % STREAK_FOR_HEALTH == 0 && this.lives < MAX_HEALTH){
            this.lives++;
        }
        this.score += this.streak;
        this.correctAnswers++;
        this.sendResult(true);
        this.feedback = "Correct!";
    }

    evalWrong(): void {
        this.streak = 0;
        this.lives--;
        this.wrong.push(this.current);
        if(this.lives == 0) {
            this.hideEverything();
            this.hideEnd = false;
            return;
        }
        this.sendResult(false);
        this.feedback = "The correct answer was " + this.current.correct;
    }

    loadVocab() {
        const parsed = JSON.parse(this.vocabularySet).vocabulary;
        const vocabString = shuffleList(parsed.split("\n")).filter(str => str.trim() !== '');
        const words: Word[] = [];

        for(let i = 0; i < vocabString.length; i++) {
            const correct: string = vocabString[i].split(";")[2];
            let answers: string[] = [correct];
            for(let answer = 0; answer < 2; answer++) {
                const index = getIndex(i, vocabString.length);
                const otherAnswer: string = vocabString[index].split(";")[2];
                answers.push(otherAnswer);
            }
            answers = shuffleList(answers);
            const id = vocabString[i].split(";")[3];
            const success_rate = parseInt(vocabString[i].split(";")[4]);
            const question = vocabString[i].split(";")[0];
            const phonetic: string = vocabString[i].split(";")[1];
            const word = new Word(id, success_rate, question, phonetic, correct, answers);
            words.push(word);
            this.words = words;
            this.all = words;
        }
    }

    pushUnseenForward() {
        // we sort, and then we move the "undiscovered" words to be first
        let to_move_index = 0;
        for(let i = 0; i < this.words.length; i++){
            const word = this.words[i];
            if(word.success_rate == -1){
                const temp = this.words[to_move_index];
                this.words[to_move_index] = word;
                this.words[i] = temp
                to_move_index++;
            }
        }
    }

    startWriteTheAnswer() {
        this.hideEverything();
        this.hideWriteTheAnswer = false;
        this.loadVocab();
        shuffleList(this.words);
        this.pushUnseenForward();
        this.restart();
    }

    startOneOfThree() {
        this.hideEverything();
        this.hideChooseOfThree = false;
        this.loadVocab();
        shuffleList(this.words);
        this.pushUnseenForward();
        this.restart();
    }

    startFlashcards(){
        this.hideEverything();
        this.hideFlashcards = false;
        this.loadVocab();
        shuffleList(this.words);
        this.nextFlashcard();
    }

    startDrawing() {
        this.hideEverything();
        this.hideDrawing = false;
    }

    checkDrawing() {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const context = canvas.getContext('2d');
        if(context != null) {
            context.fillText("我", 0, 170);
        }
    }

    checkAnswer(answer: string): void {
        if(this.current.correct == answer) {
            this.evalCorrect();
        } else {
            this.evalWrong();
        }
        this.setNewWord();
    }

    setNewWord() {
        this.index++;
        if(this.index == this.words.length) {
            this.hideEverything();
            this.hideEnd = false;
            return;
        }
        this.current = this.words[this.index];

        // TODO - make "flipped" words and make speaking in both languages functional
        this.utt.lang = this.firstLang;
        const firstVoice = this.getVoiceByName(this.selectedFirstLanguageName.getRawValue());
        if(firstVoice){
            this.utt.voice = firstVoice;
        }
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

    checkWrittenAnswer(): void{
        const answer: string = this.writtenAnswer.getRawValue();
        if(answer.length != 0){
            if(this.current.correct == answer){
                this.evalCorrect();
            } else{
                this.evalWrong();
            }
            this.setNewWord();
        }
        this.writtenAnswer.setValue("");
    }

    replayMistakes(): void {
        if(this.wrong.length > 0){
            this.words = this.wrong;
            this.hideEverything();
            this.hideChooseOfThree = false;
            this.restart();
        }
    }

    replay(): void {
        this.words = this.all;
        // TODO reset aby fungovla na kazdem modu...
        this.hideEverything();
        this.hideChooseOfThree = false;
        this.restart();
    }

    restart(): void {
        this.index = 0;
        this.score = 0;
        this.streak = 0;
        this.lives = 3;
        this.correctAnswers = 0;
        this.words = shuffleList(this.words);
        this.wrong = [];
        this.current = this.words[0];
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
      const word = list[i];
    if(word.success_rate == -1){
      const temp = list[to_move_index];
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