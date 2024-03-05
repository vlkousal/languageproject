export const STREAK_FOR_HEALTH: number = 3;
export const MAX_HEALTH: number = 10;

export class Word {

    question: string;
    phonetic: string;
    correct: string;
    answers: string[];

    constructor(question: string, phonetic: string, correct: string, answers: string[]) {
        this.question = question;
        this.phonetic = phonetic
        this.correct = correct;
        this.answers = answers;
    }
}

export class VocabularySet {

    name: string;
    url: string;
    first_flag: string;
    second_flag: string;

    constructor(name: string, url: string, first_flag: string, second_flag: string) {
        this.name = name;
        this.url = url;
        this.first_flag = first_flag;
        this.second_flag = second_flag;
    }
}
