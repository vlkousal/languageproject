import {WordInterface} from "./constants";
import {Word} from "../Word";

export class Utils {

    static getRandomDifferentIndex(blocked: number, ceil: number): number {
        let index = Math.floor(Math.random() * ceil);
        while(index == blocked) {
            index = Math.floor(Math.random() * ceil);
        }
        return index;
    }

    static shuffleList(list: any[]): any[] {
        for (let i = list.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [list[i], list[j]] = [list[j], list[i]];
        }
        // we sort, and then we move the "undiscovered" words to be first
        let to_move_index = 0;
        for(let i = 0; i < list.length; i++) {
            const word = list[i];
            if(word.success_rate == -1) {
                const temp = list[to_move_index];
                list[to_move_index] = word;
                list[i] = temp
                to_move_index++;
            }
        }
        return list;
    }

    static getRandomElement(list: Word[]) {
        const randomIndex = Math.floor(Math.random() * list.length);
        return list[randomIndex];
    }

    static getRandomInteger(l: number, r: number) {
        return Math.floor(Math.random() * (r - l + 1)) + l;
    }

    static getThirtyDaysFromNow(): Date {
        const expiresDate = new Date();
        expiresDate.setDate(expiresDate.getDate() + 30);
        return expiresDate;
    }

    static removeDiacritics(inputString: string): string {
        return inputString.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    static parseTextToVocabulary(content: string, delimiter: string): Set<WordInterface> {
        const words = new Set<WordInterface>();
        const lines: string[] = (content + "\n").split("\n");

        for(let i = 0; i < lines.length - 1; i++) {
            if(!Utils.isValidLine(lines[i], delimiter)) continue;
            const line: string = lines[i];
            const first: string = line.split(delimiter)[0].trim();
            const phonetic: string = line.split(delimiter)[1].trim();
            const second: string = line.split(delimiter)[2].trim();

            const word: WordInterface = {first, phonetic, second};
            if(Utils.isValidLine(lines[i], delimiter) && word.first.length != 0 && word.second.length != 0) {
                words.add(word);
            }
        }
        return words;
    }

    static isValidLine(line: string, delimiter: string): boolean {
        const splitLine: string[] = line.split(delimiter);
        return splitLine.length == 3;
    }
}
