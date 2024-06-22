export class Utils {
    static getIndex(blocked: number, ceil: number): number {
        let index = Math.floor(Math.random() * ceil);
        while(index == blocked) {
            index = Math.floor(Math.random() * ceil);
        }
        return index;
    }

    static shuffleList(list: any[]) {
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

    static getRandomElement(list: any[]) {
        // Generate a random index within the range of the list's length
        const randomIndex = Math.floor(Math.random() * list.length);
        // Return the element at the random index
        return list[randomIndex];
    }
}