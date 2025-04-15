import { Component } from '@angular/core';
import {Word} from "../../../word";
import {FormControl} from "@angular/forms";
import {DEFAULT_DELIMETER} from "../../constants";
import {Utils} from "../../utils";

@Component({
  selector: 'app-vocabulary-text-input',
  templateUrl: './vocabulary-text-input.component.html',
  styleUrls: ['./vocabulary-text-input.component.css']
})
export class VocabularyTextInputComponent {

    counter: number = 0;
    delimiter = new FormControl(DEFAULT_DELIMETER) as FormControl<string>;
    content: string = "";
    filteredWords: Word[] = [];

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if(input == null || input.files == null) {
            return;
        }
        const selectedFile = input.files[0];
        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
            if(e.target != null && e.target.result != null) {
                this.content = e.target.result.toString();
                this.onInputChange();
            }
        };
        reader.readAsText(selectedFile);
    }

    onInputChange(): void {
        this.counter = 0;
        const lines: string[] = (this.content + "\n").split("\n");
        const delimiter = this.getDelimeter();

        if(this.content.length != 0) {
            for(let i = 0; i < lines.length - 1; i++) {
                const line: string = lines[i];
                const word = new Word(0, [],  line.split(delimiter)[0],
                    line.split(delimiter)[1], line.split(delimiter)[2], [], []);

                if(this.isValidLine(lines[i]) && word.question.length != 0 && word.correct.length != 0) {
                    if(!this.set.words.includes(word)) {
                        this.set.words.push(word);
                        this.counter++;
                    }
                }
            }
        }
        this.onWordsFilterChange();
    }

    isValidLine(line: string): boolean {
        const splitLine: string[] = line.split(this.getDelimeter());
        return splitLine.length == 3;
    }

    getDelimeter(): string {
        return this.delimiter.getRawValue();
    }

    onWordsFilterChange() {
        const filter: string = Utils.removeDiacritics(this.getWordsFilter());
        if(filter.length != 0 && this.set != undefined) {
            this.filteredWords = [];
            this.set.words.forEach((word) => {
                const correct = Utils.removeDiacritics(word.correct);
                const phonetic = Utils.removeDiacritics(word.phonetic);
                const question = Utils.removeDiacritics(word.question);
                if(correct.includes(filter) || phonetic.includes(filter) || question.includes(filter)) {
                    this.filteredWords.push(word);
                }
            })
            return;
        }
        if(this.set != undefined) this.filteredWords = this.set.words;
    }
}
