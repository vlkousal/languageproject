import {Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild} from '@angular/core';
import {Word} from "../../../word";
import {FormControl} from "@angular/forms";
import {VocabularySet} from "../../../VocabularySet";
import {DEFAULT_DELIMETER, Language} from "../../constants";

enum Category {
    TEXT = 0,
    RELEVANT = 1,
    PREVIEW = 2
}

@Component({
  selector: 'app-word-input',
  templateUrl: './word-input.component.html',
  styleUrls: ['./word-input.component.css']
})
export class WordInputComponent {

    @Input() language: Language | null = null;
    @Input() relevantWords: Set<Word> = new Set<Word>();
    @Input() setID: number | null = null;

    @Output() onGoBack: EventEmitter<void> = new EventEmitter();

    filter: FormControl<string> = new FormControl("") as FormControl<string>;
    removedFromRelevant: Set<Word> = new Set<Word>();

    selectedCategory: Category = Category.TEXT;

    words: Set<Word> = new Set<Word>();

    textContent: string = "";
    delimiter = new FormControl(DEFAULT_DELIMETER) as FormControl<string>;

    filteredRelevantWords: Set<Word> = new Set<Word>();

    constructor(private renderer: Renderer2) { }

    @ViewChild('textButton', { static: true }) textButton!: ElementRef;
    @ViewChild('relevantButton', { static: true }) relevantButton!: ElementRef;
    @ViewChild('summaryButton', { static: true }) previewButton!: ElementRef;

    ngOnInit(): void {
        this.filteredRelevantWords = this.relevantWords;
    }

    showText() {
        this.selectedCategory = Category.TEXT
        this.filter.setValue("");
        this.renderer.setStyle(this.textButton.nativeElement, 'background-color', "#F9F8EB");
        this.renderer.setStyle(this.relevantButton.nativeElement, 'background-color', "#5C8D89");
        this.renderer.setStyle(this.previewButton.nativeElement, 'background-color', "#5C8D89");
    }

    showRelevant() {
        this.selectedCategory = Category.RELEVANT;
        this.filter.setValue("");
        this.renderer.setStyle(this.textButton.nativeElement, 'background-color', "#5C8D89");
        this.renderer.setStyle(this.relevantButton.nativeElement, 'background-color', "#F9F8EB");
        this.renderer.setStyle(this.previewButton.nativeElement, 'background-color', "#5C8D89");
    }

    showTable() {
        this.selectedCategory = Category.PREVIEW;
        this.filter.setValue("");
        this.renderer.setStyle(this.textButton.nativeElement, 'background-color', "#5C8D89");
        this.renderer.setStyle(this.relevantButton.nativeElement, 'background-color', "#5C8D89");
        this.renderer.setStyle(this.previewButton.nativeElement, 'background-color', "#F9F8EB");
    }

    addWord(word: Word) {
        const delimeter = this.delimiter.value;
        if(this.textContent.charAt(this.textContent.length - 1) != "\n" &&
            this.textContent.charAt(this.textContent.length - 1) != "") {
            this.textContent += "\n";
        }
        this.textContent += word.question + delimeter + word.phonetic + delimeter + word.correct + "\n";
        this.removedFromRelevant.add(word);
        this.relevantWords.delete(word);
    }

    protected readonly Category = Category;
    protected readonly console = console;
}
