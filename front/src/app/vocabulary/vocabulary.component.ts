import { Component } from '@angular/core';
import {FLAGS, Word} from "../constants";
import {ActivatedRoute} from "@angular/router";
import {ApiTools} from "../api-tools";
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

            let flippedAnswers: string[] = [word.question];
            for(let answer = 0; answer < 2; answer++) {
                const index = Utils.getRandomDifferentIndex(i, json.vocabulary.length);
                flippedAnswers.push(json.vocabulary[index].question);
            }
            flippedAnswers = Utils.shuffleList(flippedAnswers);

            word = new Word(word.id, word.scores, word.question, word.phonetic,
              word.correct, answers, flippedAnswers);
            words.push(word);
        });
        this.words = words;
        VocabUtils.sortByFirst(this.words);
        this.VocabUtils.sortByFirst(this.words);
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
    protected readonly FLAGS = FLAGS;
}
