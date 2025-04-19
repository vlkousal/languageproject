export const STREAK_FOR_HEALTH: number = 3;
export const MAX_HEALTH: number = 10;
export const BACKEND: string = "http://localhost:8000/";
export const USERNAME_MIN_LENGTH: number = 4
export const USERNAME_MAX_LENGTH: number = 16
export const PASSWORD_MIN_LENGTH: number = 5;

export enum Mode {
    OneOfThree = 0,
    WriteTheAnswer = 1,
    Flashcards = 2,
    DrawCharacters = 3
}

export interface Language {
    name: string;
    alpha2: string;
}

export interface Category {
    name: string;
    iconName: string;
}

export interface WordInterface {
    first: string;
    phonetic: string;
    second: string;
}

export const DEFAULT_DELIMETER = ",";
