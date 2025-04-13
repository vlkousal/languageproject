import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Language} from "../../constants";

@Component({
  selector: 'app-language-selection',
  templateUrl: './language-selection.component.html',
  styleUrls: ['./language-selection.component.css']
})
export class LanguageSelectionComponent {

    @Input() languages: Language[] | undefined;

    selectedLanguage: Language | null = null;
    @Output() onContinue = new EventEmitter<Language>();

    selectLanguage(lang: Language) {
        this.selectedLanguage = lang;
        console.log('Vybral jsi jazyk:', lang);
    }

    goNext(): void {
        if(this.selectedLanguage != null) this.onContinue.emit(this.selectedLanguage);
    }

}
