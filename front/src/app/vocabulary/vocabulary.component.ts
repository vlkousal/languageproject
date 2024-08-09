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
    index: number = 0;
    feedback: string = "";
    url: string = "";
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
        const vocab: string =  await ApiTools.getVocabJson(this.url)
        const json = JSON.parse(vocab);
        this.name = json.name;
        this.contributor = json.author;
        this.description = json.description;
        this.firstLanguage = json.first_language;
        this.secondLanguage = json.second_language;

        const words: Word[] = [];
        json.vocabulary.forEach((word: any, i: number) => {
            let answers: string[] = [word.correct];
            for(let answer = 0; answer < 2; answer++) {
                const index = Utils.getRandomDifferentIndex(i, json.vocabulary.length);
                answers.push(json.vocabulary[index].correct);
            }
            answers = Utils.shuffleList(answers);
            word = new Word(word.id, 0, word.question, word.phonetic,
              word.correct, answers);
            console.log(word.correct, word.answers)
            words.push(word);
        });
        this.words = words;

        VocabUtils.sortByFirst(this.words);
        this.VocabUtils.sortByFirst(this.words);
        this.pushUnseenForward();
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
