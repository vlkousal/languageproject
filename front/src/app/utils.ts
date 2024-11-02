import {Word} from "../word";

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
}
