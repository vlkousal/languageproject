import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Utils} from "../utils";
import {SpeechUtils} from "../speechutils";
import {FLAGS, Word} from "../constants";
import {ApiTools} from "../apitools";

@Component({
  selector: 'app-game-settings',
  templateUrl: './game-settings.component.html',
  styleUrls: ['./game-settings.component.css']
})
export class GameSettingsComponent {

    @Input() words: Word[] = [];
    @Output() closeSettings: EventEmitter<void> = new EventEmitter();
    volume: number = 1;
    languageNames: string[] = [];
    firstLanguage: string = "first";
    secondLanguage: string = "second";
    firstVoice: string = "";
    secondVoice: string = "";
    showPhonetic: boolean = true;

    ngOnInit(): void {
        const volume = localStorage.getItem("volume");
        if(volume == null) {
            this.volume = 50;
        } else {
            this.volume = Math.round(Number(volume) * 100);
        }
        this.languageNames = SpeechUtils.getVoices().sort();
        this.setFirstAndSecondLanguage();
        window.addEventListener('storage', this.onLocalStorageChange.bind(this), false);
    }

    onVolumeChange(): void {
        localStorage.setItem("volume", String(this.volume / 100));
    }

    testFirstVoice(): void {
        const randomWord = Utils.getRandomElement(this.words);
        SpeechUtils.speak(randomWord.question);
    }

    testSecondVoice(): void {
        const randomWord = Utils.getRandomElement(this.words);
        SpeechUtils.speak(randomWord.correct, true);
    }

    setFirstAndSecondLanguage(): void {
        const first = localStorage.getItem("firstLanguage");
        const second = localStorage.getItem("secondLanguage");
        if(first == null || second == null) return;
        this.firstLanguage = first;
        this.secondLanguage = second;

        if(this.firstLanguage != null) {
            const firstVoice: string | null = localStorage.getItem(this.firstLanguage);
            if(firstVoice != null){
                this.firstVoice = firstVoice;
            }
        }

        if(this.secondLanguage != null) {
            const secondVoice: string | null = localStorage.getItem(this.secondLanguage);
            if(secondVoice != null){
                this.secondVoice = secondVoice;
            }
        }
    }

    onFirstLanguageChange(): void {
        console.log(this.firstLanguage);
        localStorage.setItem(this.firstLanguage, this.firstVoice);
    }

    onSecondLanguageChange(): void {
        console.log(this.secondVoice);
        localStorage.setItem(this.secondLanguage, this.secondVoice);
    }

    onShowPhoneticChange(): void {
        console.log("DO NOT REDEEM SAAR");
        console.log(this.showPhonetic);
        localStorage.setItem("showPhonetic", String(this.showPhonetic));
    }

    onLocalStorageChange(event: StorageEvent): void {
        console.log("jop!!");
    }

    protected readonly FLAGS = FLAGS;
}
