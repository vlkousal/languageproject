import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {Word} from "../../../word";
import {Mode} from "../../constants";
import {SpeechUtils} from "../../speechutils";
import {VocabularySet} from "../../../vocabulary-set";

@Component({
  selector: 'app-vocab-table',
  templateUrl: './vocab-table.component.html',
  styleUrls: ['./vocab-table.component.css']
})
export class VocabTableComponent {

    @Input() mode: Mode = Mode.OneOfThree;
    @Input() set: VocabularySet = new VocabularySet("", -1, "", "", "", [], false);
    @Output() onPlayClick: EventEmitter<void> = new EventEmitter();

    averageScore: number = 0;

    ngOnInit() {
        if(this.mode == null) {
            this.averageScore = Math.floor(this.set.getAverageScore());
        } else {
            this.averageScore = Math.floor(this.set.getAverageModeScore(this.mode));
        }
        Word.sortByScore(this.set.words, this.mode);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if(changes["mode"]) {
            console.log(changes["mode"]);
            Word.sortByScore(this.set.words, this.mode);
            if(this.mode == null) {
                this.averageScore = Math.floor(this.set.getAverageScore());
            } else {
                this.averageScore = Math.floor(this.set.getAverageModeScore(this.mode));
            }
        }
    }

    protected readonly Word = Word;
    protected readonly Mode = Mode;
    protected readonly SpeechUtils = SpeechUtils;
    protected readonly Math = Math;
}
