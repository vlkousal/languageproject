import {BACKEND, Mode} from "./constants";


export class ApiTools {

    static async getVocabJson(url: string): Promise<string> {
        try {
            const response = await fetch(BACKEND + 'api/getvocab/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"url": url, "token": localStorage.getItem("sessionId")})
        });

        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        return await response.text();

        } catch (error) {
            console.error('Error:', error);
            throw error;
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

    static async getRelevantVocabulary(firstLanguage: string, secondLanguage: string): Promise<string> {
        try {
            const response = await fetch(BACKEND + "api/getlanguagevocab/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }, body: JSON.stringify({
                    "first_language": firstLanguage,
                    "second_language": secondLanguage
                })
            });

            if(response.ok) {
                return await response.text();
            }
            throw new Error("XD ROFL LMAO");
        } catch(error) {
            console.error("Error:", error);
            throw error;
        }
    }

    static async getLanguageJson(): Promise<string> {
        try {
            const response = await fetch(BACKEND + 'api/get_languages/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                return await response.text();
            }
            throw new Error('Network response was not ok.');
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    static async getHighScore(url: string, mode: Mode): Promise<number> {
        const data = {
            "token": localStorage.getItem("sessionId"),
            "url": url,
            "mode": mode.valueOf()
        }

        try {
            const response = await fetch(BACKEND + 'api/gethighscore/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const json = await response.json();
            return json.highScore;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
}

