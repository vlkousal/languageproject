import {Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild} from '@angular/core';
import {Word} from "../../../word";
import {Utils} from "../../utils";
import {FormControl} from "@angular/forms";
import {State} from "../../constants";
import {VocabularySet} from "../../../vocabulary-set";

enum Category {
    TEXT = 0,
    RELEVANT = 1,
    SUMMARY = 2
}

@Component({
  selector: 'app-set-words-component',
  templateUrl: './set-words-component.component.html',
  styleUrls: ['./set-words-component.component.css']
})
export class SetWordsComponentComponent {

    @Input() set: VocabularySet | undefined;
    @Input() language: string = "";
    @Input() relevantWords: Set<Word> = new Set<Word>();
    @Input() previousUrl: string | null = null;

    @Output() onGoBack: EventEmitter<void> = new EventEmitter();

    filteredWords: Word[] = [];
    filter: FormControl<string> = new FormControl("") as FormControl<string>;
    wordsFilter: FormControl<string> = new FormControl("") as FormControl<string>;
    removedFromRelevant: Set<Word> = new Set<Word>();

    selectedCategory: Category = Category.TEXT;
    content: string = "";
    delimiter = new FormControl(";") as FormControl<string>;
    counter: number = 0;
    filteredRelevantWords: Set<Word> = new Set<Word>();
    state: State = State.WORD_PAGE;

    constructor(private renderer: Renderer2) { }

    @ViewChild('textButton', { static: true }) textButton!: ElementRef;
    @ViewChild('relevantButton', { static: true }) relevantButton!: ElementRef;
    @ViewChild('summaryButton', { static: true }) summaryButton!: ElementRef;

    ngOnInit(): void {
        this.filteredRelevantWords = this.relevantWords;

        if(this.set != null) {
            this.set.words.forEach((word: Word) => {
                this.content += word.question + this.getDelimeter() + word.phonetic + this.getDelimeter() +
                    word.correct + "\n";
            });
        }
        this.onInputChange();
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
        this.wordsFilter.setValue("");false
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

    addWord(word: Word) {
        if(this.set == undefined || this.set.words.includes(word)) return;

        const delimeter = this.getDelimeter();
        if(this.content.charAt(this.content.length - 1) != "\n" &&
            this.content.charAt(this.content.length - 1) != "") {
            this.content += "\n";
        }
        this.content += word.question + delimeter + word.phonetic + delimeter + word.correct + "\n";
        this.onInputChange();
        this.onWordsFilterChange();
        this.removedFromRelevant.add(word);
        this.relevantWords.delete(word);
    }

    removeWord(word: Word) {
        const delimiter: string = this.getDelimeter();
        const lines: string[] = this.content.split("\n");
        const line: string = word.question + delimiter + word.phonetic + delimiter + word.correct;
        this.content = "";
        lines.forEach( (l) => {
            if(l != line && l != "") {
                this.content += l + "\n";
            }
        })
        this.onInputChange();
        this.onWordsFilterChange();

        if(Word.containsWord(this.removedFromRelevant, word)) {
            this.removedFromRelevant.delete(word);
            this.relevantWords.add(word);
        }
    }

    isValidLine(line: string): boolean {
        const splitLine: string[] = line.split(this.getDelimeter());
        return splitLine.length == 3;
    }

    onInputChange(): void {
        if(this.set == undefined) return;
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
    protected readonly State = State;
}
