import {Word} from "./constants";

export class VocabUtils {

    static sortByFirst(words: Word[]): void {
        words.sort((a, b) => {
            if (a.question < b.question) return -1;
            if (a.question > b.question) return 1;
            return 0;
        });
    }

    static sortByPhonetic(words: Word[]): void{
        words.sort((a, b) => {
            if (a.phonetic < b.phonetic) return -1;
            if (a.phonetic > b.phonetic) return 1;
            return 0;
        });
    }

    static sortByAnswer(words: Word[]): void{
        words.sort((a, b) => {
            if (a.correct < b.correct) return -1;
            if (a.correct > b.correct) return 1;
            return 0;
        });
    }

    static sortBySuccessRate(words: Word[]): void{
        words.sort((a, b) => {
            if (a.success_rate < b.success_rate) return -1;
            if (a.success_rate > b.success_rate) return 1;
            return 0;
        });
    }
}