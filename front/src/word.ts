import {Mode} from "./app/constants";

enum Property {
    None = -1,
    First = 0,
    Phonetic = 1,
    Answer = 2,
    AverageScore = 3,
    Score = 4
}

export class Word {

    id: number;
    scores: number[];
    question: string;
    phonetic: string;
    correct: string;
    answers: string[];
    flippedAnswers: string[];

    static sortProperty: Property = Property.None;

    constructor(id: number,  score: number[], question: string,
                phonetic: string, correct: string, answers: string[],
                flippedAnswers: string[]) {
        this.id = id;
        this.scores = score;
        this.question = question;
        this.phonetic = phonetic
        this.correct = correct;
        this.answers = answers;
        this.flippedAnswers = flippedAnswers;
    }

    getAverageScore(): number {
        let value: number = 0;
        for(let i = 0; i < this.scores.length; i++) {
            value += this.scores[i];
        }
        return value / this.scores.length;
    }

    getModeScore(mode: Mode): number {
        return this.scores[mode];
    }

    static sortByFirst(words: Word[]): void {
        Word.sortByProperty(words, "question", Property.First);
    }

    static sortByPhonetic(words: Word[]): void {
        Word.sortByProperty(words, "phonetic", Property.Phonetic);
    }

    static sortByAnswer(words: Word[]): void {
        Word.sortByProperty(words, "correct", Property.Answer);
    }

    static sortByAverageScore(words: Word[]): void {
        if(Word.sortProperty != Property.AverageScore) {
            Word.sortProperty = Property.AverageScore;
            words.sort( (a, b) => {
                if(a.getAverageScore() < b.getAverageScore()) return -1;
                if(a.getAverageScore() > b.getAverageScore()) return 1;
                return 0;
            })
            return;
        }
        Word.sortProperty = Property.None;
        words.sort( (a, b) => {
            if(a.getAverageScore() < b.getAverageScore()) return 1;
            if(a.getAverageScore() > b.getAverageScore()) return -1;
            return 0;
        })
    }

    static sortByModeScore(words: Word[], mode: Mode): void {
        console.log(mode.toString());
        if(Word.sortProperty != Property.Score) {
            Word.sortProperty = Property.Score;
            words.sort( (a, b) => {
                if(a.getModeScore(mode) < b.getModeScore(mode)) return -1;
                if(a.getModeScore(mode) > b.getModeScore(mode)) return 1;
                return 0;
            })
            return;
        }
        Word.sortProperty = Property.None;
        words.sort( (a, b) => {
            if(a.getModeScore(mode) < b.getModeScore(mode)) return 1;
            if(a.getModeScore(mode) > b.getModeScore(mode)) return -1;
            return 0;
        })
    }

    static getAverageModeScore(words: Word[], mode: Mode): number {
        let add = 0;
        for(let i = 0; i < words.length; i++) {
            add += words[i].scores[mode.valueOf()];
        }
        return Math.floor(add / words.length);
    }

    static sortByScore(words: Word[], mode: Mode): Word[] {
        words.sort((a, b) => {
            if (a.scores[mode] < b.scores[mode]) return -1;
            if (a.scores[mode] > b.scores[mode]) return 1;
            return 0;
        });
        return words;
    }

    private static sortByProperty(words: Word[], property: keyof Word, statusValue: number): void {
        if (Word.sortProperty !== statusValue) {
            Word.sortProperty = statusValue;
            words.sort((a, b) => {
                if (a[property] < b[property]) return -1;
                if (a[property] > b[property]) return 1;
                return 0;
            });
        } else {
            Word.sortProperty = Property.None;
            words.sort((a, b) => {
                if (a[property] < b[property]) return 1;
                if (a[property] > b[property]) return -1;
                return 0;
            });
        }
    }
}