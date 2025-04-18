import { Component } from '@angular/core';
import {Word} from "../../../word";
import {FormControl} from "@angular/forms";
import {DEFAULT_DELIMETER} from "../../constants";

@Component({
  selector: 'app-vocabulary-text-input',
  templateUrl: './vocabulary-text-input.component.html',
  styleUrls: ['./vocabulary-text-input.component.css']
})
export class VocabularyTextInputComponent {

    delimiter: FormControl<string> = new FormControl(DEFAULT_DELIMETER) as FormControl<string>;
    content: string = "";
    words: Set<Word> = new Set<Word>();

    onInputChange(): void {
        this.words = new Set<Word>();
        const lines: string[] = (this.content + "\n").split("\n");
        const delimiter = this.delimiter.value;

        for(let i = 0; i < lines.length - 1; i++) {
            if(!this.isValidLine(lines[i])) continue;
            const line: string = lines[i];
            const first: string = line.split(delimiter)[0].trim();
            const phonetic: string = line.split(delimiter)[1].trim();
            const second: string = line.split(delimiter)[2].trim();
            const word = new Word(0, [],  first, phonetic, second, [], []);
            if(this.isValidLine(lines[i]) && word.question.length != 0 && word.correct.length != 0) {
                if(!this.words.has(word)) {
                    this.words.add(word);
                }
            }
        }
    }

    isValidLine(line: string): boolean {
        const splitLine: string[] = line.split(this.delimiter.value);
        return splitLine.length == 3;
    }

    protected readonly DEFAULT_DELIMETER = DEFAULT_DELIMETER;
}
