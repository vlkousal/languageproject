import {Word} from "./word";

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

    static sortByName(sets: VocabularySet[]) {
        sets.sort( (a, b) => {
            if(a.name < b.name) return -1;
            if(a.name > b.name) return 1;
            return 0;
        })
    }

    static getAverageScore(set: VocabularySet) {
        let avgOfAvg: number = 0;
        set.words.forEach(word => {
            avgOfAvg += word.getAverageScore();
        })
        return avgOfAvg / set.words.length;
    }
}