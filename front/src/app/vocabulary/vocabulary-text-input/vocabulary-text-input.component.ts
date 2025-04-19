import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl} from "@angular/forms";
import {DEFAULT_DELIMETER, WordInterface} from "../../constants";
import {Utils} from "../../utils";

@Component({
  selector: 'app-vocabulary-text-input',
  templateUrl: './vocabulary-text-input.component.html',
  styleUrls: ['./vocabulary-text-input.component.css']
})
export class VocabularyTextInputComponent {

    @Input() words: Set<WordInterface> = new Set<WordInterface>();
    @Output() wordsChange = new EventEmitter<Set<WordInterface>>();

    delimiter: FormControl<string> = new FormControl(DEFAULT_DELIMETER) as FormControl<string>;
    content: string = "";

    ngOnInit(): void {
        this.writeCurrentWords();
    }

    writeCurrentWords(): void {
        for(const word of this.words.values()) {
            const delimiter = this.delimiter.value;
            const wordString = word.first + delimiter + word.phonetic + delimiter + word.second + "\n";
            this.content += wordString;
        }
    }

    onInputChange(): void {
        this.words = Utils.parseTextToVocabulary(this.content, this.delimiter.value);
        this.wordsChange.emit(this.words);
    }
}
