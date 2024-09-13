import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {Word} from "../../../word";
import {Mode} from "../../constants";
import {SpeechUtils} from "../../speechutils";

@Component({
  selector: 'app-vocab-table',
  templateUrl: './vocab-table.component.html',
  styleUrls: ['./vocab-table.component.css']
})
export class VocabTableComponent {

    @Input() mode: Mode = Mode.OneOfThree;
    @Input() words: Word[] = [];

    @Output() onPlayClick: EventEmitter<void> = new EventEmitter();

    averageScore: number = 0;

    ngOnInit() {
        this.averageScore = Word.getAverageModeScore(this.words, this.mode);
        Word.sortByScore(this.words, this.mode);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if(changes["mode"]) {
            Word.sortByScore(this.words, this.mode);
        }
    }

    protected readonly Word = Word;
    protected readonly Mode = Mode;
    protected readonly SpeechUtils = SpeechUtils;
}
