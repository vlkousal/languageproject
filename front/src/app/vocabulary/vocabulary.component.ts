import { Component } from '@angular/core';
import {BACKEND, FLAGS, Mode} from "../constants";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiTools} from "../api-tools";
import {first} from "rxjs";
import {Utils} from "../utils";
import {Word} from "../../word";
import {SpeechUtils} from "../speechutils";
import {CookieService} from "ngx-cookie";

@Component({
    selector: 'app-vocabulary',
    templateUrl: './vocabulary.component.html',
    styleUrls: ['./vocabulary.component.css']
})
export class VocabularyComponent {

    words: Word[] = [];
    characters: Word[] = [];

    index: number = 0;
    url: string = "";
    name: string = "";
    description: string = "";
    contributor: string = "";
    firstLanguage: string = "";
    secondLanguage: string = "";
    languageNames: string[] = [];
    mode: Mode | null = null;
    loading: boolean = true;

    selectedMode: Mode | null = null;
    tableWords: Word[] = [];
    username: string = "";

    isSaved: boolean = false;

    constructor(private route: ActivatedRoute, private router: Router, private cookieService: CookieService) { }

    async ngOnInit() {
        this.route.params.subscribe(params => {
            this.url = params['vocabUrl'];
        });
        await this.setup();
        this.characters = this.words.filter(w => w.question.length === 1);

        this.languageNames.sort();
        Word.sortByAverageScore(this.words);
        sessionStorage.setItem("firstLanguage", this.firstLanguage);
        sessionStorage.setItem("secondLanguage", this.secondLanguage);
        this.tableWords = [...this.words];

        this.username = JSON.parse(await this.getUsername())["username"];
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
            url: this.url,
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
            url: this.url,
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
        const vocab: string =  await ApiTools.getVocabJson(this.url, this.cookieService);
        if(vocab == "404") {
            this.router.navigate(["/404"]);
        }
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
        Word.sortByFirst(this.words);
    }

    protected readonly first = first;
    protected readonly FLAGS = FLAGS;
    protected readonly Mode = Mode;
    protected readonly SpeechUtils = SpeechUtils;
    protected readonly Word = Word;
}
