import { Component } from '@angular/core';
import {Word} from "../../../word";
import {Utils} from "../../utils";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-vocabulary-preview',
  templateUrl: './vocabulary-preview.component.html',
  styleUrls: ['./vocabulary-preview.component.css']
})
export class VocabularyPreviewComponent {

    filteredWords: Word[] = [];
    words: Word[] = [];
    wordsFilter: FormControl<string> = new FormControl("") as FormControl<string>;

    onWordsFilterChange() {
        const filter: string = Utils.removeDiacritics(this.wordsFilter.value);
        if(filter.length != 0) {
            this.filteredWords = [];
            this.words.forEach((word) => {
                const correct = Utils.removeDiacritics(word.correct);
                const phonetic = Utils.removeDiacritics(word.phonetic);
                const question = Utils.removeDiacritics(word.question);
                if(correct.includes(filter) || phonetic.includes(filter) || question.includes(filter)) {
                    this.filteredWords.push(word);
                }
            })
            return;
        }
        this.filteredWords = this.words;
    }
}
