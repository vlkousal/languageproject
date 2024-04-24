import { Component } from '@angular/core';
import {BACKEND, FLAGS, MAX_HEALTH, STREAK_FOR_HEALTH, Word} from "../constants";
import {ActivatedRoute} from "@angular/router";
import {ApiTools} from "../apitools";
import {VocabUtils} from "../vocabutils";
import {first} from "rxjs";
import {FormControl} from "@angular/forms";
import {Drawing} from "../drawinglogic";
import {Utils} from "../utils";
import {SpeechUtils} from "../speechutils";
import {WriteTheAnswerComponent} from "../writetheanswer/write-the-answer.component";

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

    hideChooseOfThree: boolean = true;
    hidePreview: boolean = false;
    hideWriteTheAnswer: boolean = true;
    hideEnd: boolean = true;
    hideFlashcards: boolean = true;
    hideDrawing: boolean = true;

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

    hideEverything() {
        this.hidePreview = true;
        this.hideWriteTheAnswer = true;
        this.hideChooseOfThree = true;
        this.hideEnd = true;
    }

    testSecondVoice() {
        const randomWord = Utils.getRandomElement(this.words);
        SpeechUtils.speak(randomWord.correct, false);
    }

    testFirstVoice() {
        const randomWord = Utils.getRandomElement(this.words);
        SpeechUtils.speak(randomWord.question);
    }


    getVoiceByName(name: string) {
        return speechSynthesis.getVoices().find(voice => voice.name === name);
    }

    onFirstLanguageChange() {
        const voice = this.getVoiceByName(this.selectedFirstLanguageName.getRawValue());
        if (voice) {
            this.SpeechUtils.first_language_utt.voice = voice;
            this.SpeechUtils.first_language_utt.lang = voice.lang;
            this.firstLang = voice.lang;
        }
        localStorage.setItem(this.firstLanguage, this.selectedFirstLanguageName.getRawValue());
    }

    onSecondLanguageChange() {
        const voice = this.getVoiceByName(this.selectedSecondLanguageName.getRawValue());
        if (voice) {
            this.SpeechUtils.second_language_utt.voice = voice;
            this.SpeechUtils.second_language_utt.lang = voice.lang;
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
        this.firstLanguage = FLAGS[json.first_language] + " " + json.first_language;
        this.secondLanguage = FLAGS[json.second_language] + " " + json.second_language;
        this.loadVocab();
        VocabUtils.sortByFirst(this.words);
        this.VocabUtils.sortByFirst(this.words);

        this.setupVoices();
    }

    setupVoices() {
        const firstName = localStorage.getItem(this.firstLanguage);
        if(firstName != null) {
            this.selectedFirstLanguageName.setValue(firstName);
            this.onFirstLanguageChange();
            const voice = this.getVoiceByName(this.selectedFirstLanguageName.getRawValue());
            if (voice) {
                this.SpeechUtils.first_language_utt.voice = voice;
                this.SpeechUtils.first_language_utt.lang = voice.lang;
                this.firstLang = voice.lang;
            }
        }

        const secondName = localStorage.getItem(this.secondLanguage);
        if(secondName != null) {
            this.selectedSecondLanguageName.setValue(secondName);
            this.onSecondLanguageChange();

            const voice = this.getVoiceByName(this.selectedSecondLanguageName.getRawValue());
            if (voice) {
                this.SpeechUtils.second_language_utt.voice = voice;
                this.SpeechUtils.second_language_utt.lang = voice.lang;
                this.secondLang = voice.lang;
            }
        }
    }

    loadVocab() {
        const parsed = JSON.parse(this.vocabularySet).vocabulary;
        const vocabString = Utils.shuffleList(parsed.split("\n")).filter(str => str.trim() !== '');
        const words: Word[] = [];

        for(let i = 0; i < vocabString.length; i++) {
            const correct: string = vocabString[i].split(";")[2];
            let answers: string[] = [correct];
            for(let answer = 0; answer < 2; answer++) {
                const index = Utils.getIndex(i, vocabString.length);
                const otherAnswer: string = vocabString[index].split(";")[2];
                answers.push(otherAnswer);
            }
            answers = Utils.shuffleList(answers);
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
        for(let i = 0; i < this.words.length; i++) {
            const word = this.words[i];
            if(word.success_rate == -1) {
                const temp = this.words[to_move_index];
                this.words[to_move_index] = word;
                this.words[i] = temp
                to_move_index++;
            }
        }
    }

    resetCanvas(){
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const context = canvas.getContext("2d");
        if(context == null) return;
        // Clear the entire canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    checkDrawing() {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const context = canvas.getContext('2d');
        if(context != null) {
            context.fillText("我", 0, 170);
        }
    }

    restart(): void {
        this.index = 0;
        this.score = 0;
        this.streak = 0;
        this.lives = 3;
        this.correctAnswers = 0;
        this.words = Utils.shuffleList(this.words);
        this.wrong = [];
        this.current = this.words[0];
    }

    protected readonly VocabUtils = VocabUtils;
    protected readonly first = first;
    protected readonly SpeechUtils = SpeechUtils;
}