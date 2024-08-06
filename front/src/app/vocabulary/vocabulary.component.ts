import { Component } from '@angular/core';
import {FLAGS, Word} from "../constants";
import {ActivatedRoute} from "@angular/router";
import {ApiTools} from "../apitools";
import {VocabUtils} from "../vocabutils";
import {first} from "rxjs";
import {Utils} from "../utils";
import {SpeechUtils} from "../speechutils";

@Component({
    selector: 'app-vocabulary',
    templateUrl: './vocabulary.component.html',
    styleUrls: ['./vocabulary.component.css']
})
export class VocabularyComponent {

    words: Word[] = [];
    all: Word[] = [];
    index: number = 0;

    feedback: string = "";
    url: string = "";
    vocabularySet: string = "";
    name: string = "";
    description: string = "";
    contributor: string = "";
    firstLanguage: string = "";
    secondLanguage: string = "";
    languageNames: string[] = [];

    mode: string = "none";
    loading: boolean = true;

    constructor(private route: ActivatedRoute) {}

    async ngOnInit() {
        this.route.params.subscribe(params => {
            this.url = params['vocabUrl'];
        });
        await this.setup();

        this.languageNames.sort();
        //Drawing.prepCanvas();
        this.loading = false;

        localStorage.setItem("firstLanguage", this.firstLanguage);
        localStorage.setItem("secondLanguage", this.secondLanguage);
    }

    getVoiceByName(name: string) {
        return speechSynthesis.getVoices().find(voice => voice.name === name);
    }

    async setup() {
        this.vocabularySet = await ApiTools.getVocabJson(this.url)
        const json = JSON.parse(this.vocabularySet);
        this.name = json.name;
        this.contributor = json.author;
        this.description = json.description;
        this.firstLanguage = json.first_language;
        this.secondLanguage = json.second_language;
        this.loadVocab();
        VocabUtils.sortByFirst(this.words);
        this.VocabUtils.sortByFirst(this.words);

        this.pushUnseenForward();
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

    gameOver(): void {
        this.mode = "none";
    }

    resetCanvas() {
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

    protected readonly VocabUtils = VocabUtils;
    protected readonly first = first;
    protected readonly SpeechUtils = SpeechUtils;
    protected readonly FLAGS = FLAGS;
}