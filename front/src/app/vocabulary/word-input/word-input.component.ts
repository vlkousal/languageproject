import {Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild} from '@angular/core';
import {Word} from "../../../word";
import {Utils} from "../../utils";
import {FormControl} from "@angular/forms";
import {VocabularySet} from "../../../VocabularySet";
import {DEFAULT_DELIMETER, Language} from "../../constants";

enum Category {
    TEXT = 0,
    RELEVANT = 1,
    SUMMARY = 2
}

@Component({
  selector: 'app-word-input',
  templateUrl: './word-input.component.html',
  styleUrls: ['./word-input.component.css']
})
export class WordInputComponent {

    @Input() set: VocabularySet | undefined;
    @Input() language: Language | null = null;
    @Input() relevantWords: Set<Word> = new Set<Word>();
    @Input() setID: number | null = null;

    @Output() onGoBack: EventEmitter<void> = new EventEmitter();

    filteredWords: Word[] = [];
    filter: FormControl<string> = new FormControl("") as FormControl<string>;
    wordsFilter: FormControl<string> = new FormControl("") as FormControl<string>;
    removedFromRelevant: Set<Word> = new Set<Word>();

    selectedCategory: Category = Category.TEXT;

    textContent: string = "";
    delimiter = new FormControl(DEFAULT_DELIMETER) as FormControl<string>;

    filteredRelevantWords: Set<Word> = new Set<Word>();

    constructor(private renderer: Renderer2) { }

    @ViewChild('textButton', { static: true }) textButton!: ElementRef;
    @ViewChild('relevantButton', { static: true }) relevantButton!: ElementRef;
    @ViewChild('summaryButton', { static: true }) summaryButton!: ElementRef;

    ngOnInit(): void {
        this.filteredRelevantWords = this.relevantWords;

        if(this.set != null) {
            this.set.words.forEach((word: Word) => {
                this.textContent += word.question + this.getDelimeter() + word.phonetic + this.getDelimeter() +
                    word.correct + "\n";
            });
        }
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

    onFilterChange() {
        const filter = Utils.removeDiacritics(this.getFilter());
        if(filter.length != 0) {
            this.filteredRelevantWords = new Set<Word>();
            this.relevantWords.forEach((word) => {
                const correct = Utils.removeDiacritics(word.correct);
                const phonetic = Utils.removeDiacritics(word.phonetic);
                const question = Utils.removeDiacritics(word.question);
                if(correct.includes(filter) || phonetic.includes(filter) || question.includes(filter)) {
                    this.filteredRelevantWords.add(word);
                }
            });
            return;
        }
        this.filteredRelevantWords = this.relevantWords;
    }

    showText() {
        this.selectedCategory = Category.TEXT
        this.filter.setValue("");
        this.wordsFilter.setValue("");
        this.renderer.setStyle(this.textButton.nativeElement, 'background-color', "#F9F8EB");
        this.renderer.setStyle(this.relevantButton.nativeElement, 'background-color', "#5C8D89");
        this.renderer.setStyle(this.summaryButton.nativeElement, 'background-color', "#5C8D89");
    }

    showRelevant() {
        this.selectedCategory = Category.RELEVANT;
        this.filter.setValue("");
        this.wordsFilter.setValue("");
        this.renderer.setStyle(this.textButton.nativeElement, 'background-color', "#5C8D89");
        this.renderer.setStyle(this.relevantButton.nativeElement, 'background-color', "#F9F8EB");
        this.renderer.setStyle(this.summaryButton.nativeElement, 'background-color', "#5C8D89");
    }

    showTable() {
        this.selectedCategory = Category.SUMMARY;
        this.filter.setValue("");
        this.wordsFilter.setValue("");
        this.renderer.setStyle(this.textButton.nativeElement, 'background-color', "#5C8D89");
        this.renderer.setStyle(this.relevantButton.nativeElement, 'background-color', "#5C8D89");
        this.renderer.setStyle(this.summaryButton.nativeElement, 'background-color', "#F9F8EB");
    }

    addWord(word: Word) {
        if(this.set == undefined || this.set.words.includes(word)) return;

        const delimeter = this.getDelimeter();
        if(this.textContent.charAt(this.textContent.length - 1) != "\n" &&
            this.textContent.charAt(this.textContent.length - 1) != "") {
            this.textContent += "\n";
        }
        this.textContent += word.question + delimeter + word.phonetic + delimeter + word.correct + "\n";
        this.onWordsFilterChange();
        this.removedFromRelevant.add(word);
        this.relevantWords.delete(word);
    }

    removeWord(word: Word) {
        const delimiter: string = this.getDelimeter();
        const lines: string[] = this.textContent.split("\n");
        const line: string = word.question + delimiter + word.phonetic + delimiter + word.correct;
        this.textContent = "";
        lines.forEach( (l) => {
            if(l != line && l != "") {
                this.textContent += l + "\n";
            }
        })
        this.onWordsFilterChange();

        if(Word.containsWord(this.removedFromRelevant, word)) {
            this.removedFromRelevant.delete(word);
            this.relevantWords.add(word);
        }
    }

    getFilter(): string {
      return this.filter.getRawValue();
    }

    getWordsFilter(): string {
        return this.wordsFilter.getRawValue();
    }

    getDelimeter(): string {
        return this.delimiter.getRawValue();
    }

    protected readonly Category = Category;
    protected readonly console = console;
}
