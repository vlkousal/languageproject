export class VocabularySet {

    name: string;
    url: string;
    firstFlag: string;
    secondFlag: string;

    constructor(name: string, url: string, firstFlag: string, secondFlag: string) {
        this.name = name;
        this.url = url;
        this.firstFlag = firstFlag;
        this.secondFlag = secondFlag;
    }
}