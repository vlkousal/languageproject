import {BACKEND} from "./constants";


export class ApiTools {

    static async getVocabJson(url: string): Promise<string> {
        try {
            const response = await fetch(BACKEND + 'api/getvocab/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({"token": localStorage.getItem("sessionId"), "url": url})
            });

            if (response.ok) {
                return await response.text();
            }
            throw new Error('Network response was not ok.');
        } catch (error) {
            console.error('Error:', error);
            throw error; // Re-throw the error for further handling
        }
    }

    static sendResult(wordId: number, correct: boolean) {
        const data = {
            "token": localStorage.getItem("sessionId"),
            "wordId": wordId,
            "correct": correct
        }

        fetch(BACKEND + "api/addresult/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
    }
}

