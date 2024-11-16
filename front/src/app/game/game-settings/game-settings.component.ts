import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Utils} from "../../utils";
import {SpeechUtils} from "../../speechutils";
import {FLAGS} from "../../constants";
import {Word} from "../../../word";

@Component({
  selector: 'app-game-settings',
  templateUrl: './game-settings.component.html',
  styleUrls: ['./game-settings.component.css']
})
export class GameSettingsComponent {

    @Input() words: Word[] = [];
    @Output() onGoBack: EventEmitter<void> = new EventEmitter();

    volume: number = 1;
    languageNames: string[] = [];
    language: string = "language";
    languageVoice: string = "";
    englishVoice: string = "";
    showPhonetic: boolean = false;

    ngOnInit(): void {
        const volume = localStorage.getItem("volume");
        if(volume == null) {
            this.volume = 50;
        } else {
            this.volume = Math.round(Number(volume) * 100);
        }

        const languageName: string | null = sessionStorage.getItem("language");
        if(languageName != null){
            this.language = sessionStorage.getItem("language")!;
        }


        const phonetic = localStorage.getItem("showPhonetic");
        this.showPhonetic = phonetic == "true";
        this.languageNames = SpeechUtils.getVoices().sort();
        this.setLanguageVoice();
    }

    onVolumeChange(): void {
        localStorage.setItem("volume", String(this.volume / 100));
    }

    testLanguageVoice(): void {
        const randomWord = Utils.getRandomElement(this.words);
        SpeechUtils.speak(randomWord.question);
    }

    testEnglishVoice(): void {
        const randomWord = Utils.getRandomElement(this.words);
        SpeechUtils.speak(randomWord.correct);
    }

    setLanguageVoice(): void {
        const first = sessionStorage.getItem("language");
        if(first == null) return;
        this.language = first;

        if(this.language != null) {
            const firstVoice: string | null = localStorage.getItem(this.language);
            if(firstVoice != null){
                this.languageVoice = firstVoice;
            }
        }
    }

    onLanguageVoiceChange(): void {
        localStorage.setItem(this.language, this.languageVoice);
    }

    onEnglishVoiceChange(): void {
        localStorage.setItem("English", this.englishVoice);
    }

    onShowPhoneticChange(): void {
        localStorage.setItem("showPhonetic", String(this.showPhonetic));
    }

    protected readonly FLAGS = FLAGS;
}
