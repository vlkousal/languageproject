import {Word} from "./word";

export class VocabularySet {

    name: string;
    id: number;
    description: string;
    language: string;
    words: Word[];
    isOwn: boolean;

    constructor(name: string, id: number, description: string, firstLanguage: string, words: Word[], isOwn: boolean) {
        this.name = name;
        this.id = id;
        this.description = description;
        this.language = firstLanguage;
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
}