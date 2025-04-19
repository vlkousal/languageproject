import {Word} from "./Word";
import {Mode} from "./app/constants";

export class VocabularySet {

    name: string;
    id: number;
    contributor: string;
    description: string;
    language: string;
    words: Word[];
    isOwn: boolean;

    constructor(name: string, id: number, contributor: string, description: string, language: string, words: Word[], isOwn: boolean) {
        this.name = name;
        this.id = id;
        this.contributor = contributor;
        this.description = description;
        this.language = language;
        this.words = words;
        this.isOwn = isOwn;
    }

    getAverageModeScore(mode: Mode): number {
        let add = 0;
        for(let i = 0; i < this.words.length; i++) {
            add += this.words[i].scores[mode.valueOf()];
        }
        return Math.floor(add / this.words.length);
    }

    // returns the average score of all words and modes
    getAverageScore(): number {
        let avgOfAvg: number = 0;
        this.words.forEach(word => {
            avgOfAvg += word.getAverageScore();
        })
        return avgOfAvg / this.words.length;
    }

    static sortByName(sets: VocabularySet[]) {
        sets.sort( (a, b) => {
            if(a.name < b.name) return -1;
            if(a.name > b.name) return 1;
            return 0;
        })
    }
}
