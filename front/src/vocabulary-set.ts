export class VocabularySet {

    name: string;
    url: string;
    description: string;
    firstLanguage: string;
    secondLanguage: string;
    isOwn: boolean;

    constructor(name: string, url: string, description: string, firstFlag: string, secondFlag: string, isOwn: boolean) {
        this.name = name;
        this.url = url;
        this.description = description;
        this.firstLanguage = firstFlag;
        this.secondLanguage = secondFlag;
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