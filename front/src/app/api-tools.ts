import {BACKEND, Mode} from "./constants";
import {CookieService} from "ngx-cookie";


export class ApiTools {

    static async getVocabJson(url: string, cookieService: CookieService): Promise<string> {
        try {
            const response = await fetch(BACKEND + 'api/getvocab/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({url: url, token: cookieService.get("token")}),
        });

        if (!response.ok) {
            if(response.status === 404) {
                return "404";
            }
            throw new Error('Network response was not ok.');
        }
        return await response.text();

        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    static async getRelevantVocabulary(firstLanguage: string, ): Promise<string> {
        try {
            const response = await fetch(BACKEND + "api/getlanguagevocab/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }, body: JSON.stringify({
                    first_language: firstLanguage
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

    static async getHighScore(url: string, mode: Mode, cookieService: CookieService): Promise<number> {
        const data = {
            token: cookieService.get("token"),
            url: url,
            mode: mode.valueOf()
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

    static async getLanguages() : Promise<string[]> {
        try {
            const response = await fetch(BACKEND + 'api/getlanguages/', {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const json = await response.json();
            return json.languages;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
}

