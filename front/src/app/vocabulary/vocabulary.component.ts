import { Component } from '@angular/core';
import {BACKEND, FLAGS, Mode} from "../constants";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiTools} from "../api-tools";
import {first} from "rxjs";
import {Utils} from "../utils";
import {Word} from "../../word";
import {SpeechUtils} from "../speechutils";
import {CookieService} from "ngx-cookie";
import {VocabularySet} from "../../vocabulary-set";

@Component({
    selector: 'app-vocabulary',
    templateUrl: './vocabulary.component.html',
    styleUrls: ['./vocabulary.component.css']
})
export class VocabularyComponent {

    set: VocabularySet = new VocabularySet("", -1, "", "", "", [], false);
    characters: Word[] = [];

    index: number = 0;
    id: number = -1;
    languageNames: string[] = [];
    mode: Mode | null = null;
    loading: boolean = true;
    showSettings: boolean = false;
    selectedMode: Mode | null = null;
    tableWords: Word[] = [];
    username: string = "";
    isSaved: boolean = false;

    constructor(private route: ActivatedRoute, private router: Router, private cookieService: CookieService) { }

    async ngOnInit() {
        this.route.params.subscribe(params => {
            this.id = params["vocabID"];
        });
        await this.setup();
        this.characters = this.set.words.filter(w => w.question.length === 1);

        this.languageNames.sort();
        Word.sortByAverageScore(this.set.words);
        sessionStorage.setItem("language", this.set.language);

        this.tableWords = [...this.set.words];
        this.isSaved = JSON.parse(await this.getSavedStatus())["status"];
        this.loading = false;
    }

    async onGoBack(): Promise<void> {
        this.mode = null;
        this.loading = true;
        await this.setup();
        this.loading = false;
    }

    async getSavedStatus(): Promise<string> {
        const data = {
            token: this.cookieService.get("token"),
            id: this.id,
        }

        try {
            const response = await fetch(BACKEND + "api/getsavestatus/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            return await response.text();
        } catch(error) {
            console.error("Error:", error);
            throw error;
        }
    }

    async saveSet(): Promise<void> {
        const data = {
            token: this.cookieService.get("token"),
            id: this.id,
            isSaved: this.isSaved
        }

        try {
            const response = await fetch(BACKEND + "api/saveset/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            });
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
        this.isSaved = !this.isSaved;
    }

    async getUsername(): Promise<string> {
        try {
            const response = await fetch(BACKEND + "api/getusername/", {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                },
                body: JSON.stringify({token: this.cookieService.get("token")})
            });

            if (!response.ok) {
                throw new Error("Network response was not ok.");
            }
            return await response.text();

        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    async setup(): Promise<void> {
        const vocab: string =  await ApiTools.getVocabJson(this.id, this.cookieService);
        const username: string = JSON.parse(await this.getUsername())["username"];

        if(vocab == "404") {
            this.router.navigate(["/404"]);
        }
        const json = JSON.parse(vocab);

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
        this.set = new VocabularySet(json.name, this.id, json.author, json.description,
            json.language, words, false);
        Word.sortByFirst(this.set.words);
    }

    protected readonly first = first;
    protected readonly FLAGS = FLAGS;
    protected readonly Mode = Mode;
    protected readonly SpeechUtils = SpeechUtils;
    protected readonly Word = Word;
}
