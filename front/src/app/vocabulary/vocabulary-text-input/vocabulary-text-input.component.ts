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

    counter: number = 0;
    delimiter = new FormControl(DEFAULT_DELIMETER) as FormControl<string>;
    content: string = "";
    words: Word[] = [];


    onInputChange() {
        console.log(this.content);
    }
    
    protected readonly DEFAULT_DELIMETER = DEFAULT_DELIMETER;
}
