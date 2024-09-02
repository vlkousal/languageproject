export class VocabularySet {

    name: string;
    url: string;
    firstFlag: string;
    secondFlag: string;
    isOwn: boolean;

    constructor(name: string, url: string, firstFlag: string, secondFlag: string, isOwn: boolean) {
        this.name = name;
        this.url = url;
        this.firstFlag = firstFlag;
        this.secondFlag = secondFlag;
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