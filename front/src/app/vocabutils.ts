import {Mode, Word} from "./constants";

export class VocabUtils {

    static sortByFirst(words: Word[]): void {
        words.sort((a, b) => {
            if (a.question < b.question) return -1;
            if (a.question > b.question) return 1;
            return 0;
        });
    }

    static sortByPhonetic(words: Word[]): void {
        words.sort((a, b) => {
            if (a.phonetic < b.phonetic) return -1;
            if (a.phonetic > b.phonetic) return 1;
            return 0;
        });
    }

    static sortByAnswer(words: Word[]): void {
        words.sort((a, b) => {
            if (a.correct < b.correct) return -1;
            if (a.correct > b.correct) return 1;
            return 0;
        });
    }

    static sortByScore(words: Word[], mode: Mode): Word[] {
        words.sort((a, b) => {
            if (a.score[mode] < b.score[mode]) return -1;
            if (a.score[mode] > b.score[mode]) return 1;
            return 0;
        });
        return words;
    }
}