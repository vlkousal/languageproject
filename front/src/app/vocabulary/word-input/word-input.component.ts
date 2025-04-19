import {Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";
import {DEFAULT_DELIMETER, Language, WordInterface} from "../../constants";

enum Category {
    TEXT = 0,
    RELEVANT = 1,
    PREVIEW = 2,
    UPLOAD = 3
}

@Component({
  selector: 'app-word-input',
  templateUrl: './word-input.component.html',
  styleUrls: ['./word-input.component.css']
})
export class WordInputComponent {

    @Input() language: Language | null = null;
    @Input() relevantWords: Set<WordInterface> = new Set<WordInterface>();
    @Input() words: Set<WordInterface> = new Set<WordInterface>();

    @Output() onGoBack: EventEmitter<void> = new EventEmitter();
    @Output() onContinue: EventEmitter<Set<WordInterface>> = new EventEmitter();

    removedFromRelevant: Set<WordInterface> = new Set<WordInterface>();

    selectedCategory: Category = Category.TEXT;

    textContent: string = "";
    delimiter = new FormControl(DEFAULT_DELIMETER) as FormControl<string>;

    filteredRelevantWords: Set<WordInterface> = new Set<WordInterface>();

    constructor(private renderer: Renderer2) { }

    @ViewChild("textButton", { static: true }) textButton!: ElementRef;
    @ViewChild("relevantButton", { static: true }) relevantButton!: ElementRef;
    @ViewChild("summaryButton", { static: true }) previewButton!: ElementRef;
    @ViewChild("uploadButton", { static: true }) uploadButton!: ElementRef;

    ngOnInit(): void {
        this.filteredRelevantWords = this.relevantWords;
    }

    setActiveCategory(category: Category): void {
        this.selectedCategory = category;
    }

    addWord(word: WordInterface) {
        const delimeter = this.delimiter.value;
        if(this.textContent.charAt(this.textContent.length - 1) != "\n" &&
            this.textContent.charAt(this.textContent.length - 1) != "") {
            this.textContent += "\n";
        }
        this.textContent += word.first + delimeter + word.phonetic + delimeter + word.second + "\n";
        this.removedFromRelevant.add(word);
        this.relevantWords.delete(word);
    }

    protected readonly Category = Category;
    protected readonly console = console;
}
