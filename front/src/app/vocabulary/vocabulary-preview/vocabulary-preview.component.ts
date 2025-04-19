import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Utils} from "../../utils";
import {FormControl} from "@angular/forms";
import {WordInterface} from "../../constants";

@Component({
  selector: 'app-vocabulary-preview',
  templateUrl: './vocabulary-preview.component.html',
  styleUrls: ['./vocabulary-preview.component.css']
})
export class VocabularyPreviewComponent {

    @Input() words: Set<WordInterface> = new Set<WordInterface>();
    @Output() wordsChange = new EventEmitter<Set<WordInterface>>();

    filteredWords: WordInterface[] = [];
    wordsFilter: FormControl<string> = new FormControl("") as FormControl<string>;

    onWordsFilterChange(): void {
        const filter: string = Utils.removeDiacritics(this.wordsFilter.value);
        if(filter.length != 0) {
            this.filteredWords = [];
            this.words.forEach((word) => {
                const correct = Utils.removeDiacritics(word.first);
                const phonetic = Utils.removeDiacritics(word.phonetic);
                const question = Utils.removeDiacritics(word.second);
                if(correct.includes(filter) || phonetic.includes(filter) || question.includes(filter)) {
                    this.filteredWords.push(word);
                }
            })
            return;
        }
    }

    removeWord(word: WordInterface): void {
        this.words.delete(word);
        this.wordsChange.emit(this.words);
    }
}
