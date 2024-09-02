export const STREAK_FOR_HEALTH: number = 3;
export const MAX_HEALTH: number = 10;
export const BACKEND: string = "http://localhost:8000/";


export enum Mode {
    OneOfThree = 0,
    WriteTheAnswer = 1,
    Flashcards = 2,
    DrawCharacters = 3
}

type FlagsDict = {
    [key: string]: string;
};

export const FLAGS: FlagsDict = {
    "Afrikaans": "🇿🇦",
    "Albanian": "🇦🇱",
    "Amharic": "🇪🇹",
    "Arabic": "🇸🇦",
    "Armenian": "🇦🇲",
    "Azerbaijani": "🇦🇿",
    "Basque": "🇪🇸",
    "Belarusian": "🇧🇾",
    "Bengali": "🇧🇩",
    "Bosnian": "🇧🇦",
    "Bulgarian": "🇧🇬",
    "Catalan": "🇪🇸",
    "Cebuano": "🇵🇭",
    "Chichewa": "🇲🇼",
    "Chinese (Simplified)": "🇨🇳",
    "Chinese (Traditional)": "🇨🇳",
    "Corsican": "🇨🇵",
    "Croatian": "🇭🇷",
    "Czech": "🇨🇿",
    "Danish": "🇩🇰",
    "Dutch": "🇳🇱",
    "English": "🇬🇧",
    "Esperanto": "🇪🇸",
    "Estonian": "🇪🇪",
    "Filipino": "🇵🇭",
    "Finnish": "🇫🇮",
    "French": "🇫🇷",
    "Frisian": "🇳🇱",
    "Galician": "🇪🇸",
    "Georgian": "🇬🇪",
    "German": "🇩🇪",
    "Greek": "🇬🇷",
    "Gujarati": "🇮🇳",
    "Haitian Creole": "🇭🇹",
    "Hausa": "🇳🇬",
    "Hawaiian": "🇺🇸",
    "Hebrew": "🇮🇱",
    "Hindi": "🇮🇳",
    "Hmong": "🇱🇦",
    "Hungarian": "🇭🇺",
    "Icelandic": "🇮🇸",
    "Igbo": "🇳🇬",
    "Indonesian": "🇮🇩",
    "Irish": "🇮🇪",
    "Italian": "🇮🇹",
    "Japanese": "🇯🇵",
    "Javanese": "🇮🇩",
    "Kannada": "🇮🇳",
    "Kazakh": "🇰🇿",
    "Khmer": "🇰🇭",
    "Kinyarwanda": "🇷🇼",
    "Korean": "🇰🇷",
    "Kurdish (Kurmanji)": "🇭🇺",
    "Kyrgyz": "🇰🇬",
    "Lao": "🇱🇦",
    "Latin": "🏴",
    "Latvian": "🇱🇻",
    "Lithuanian": "🇱🇹",
    "Luxembourgish": "🇱🇺",
    "Macedonian": "🇲🇰",
    "Malagasy": "🇲🇬",
    "Malay": "🇲🇾",
    "Malayalam": "🇮🇳",
    "Maltese": "🇲🇹",
    "Maori": "🇳🇿",
    "Marathi": "🇮🇳",
    "Mongolian": "🇲🇳",
    "Myanmar (Burmese)": "🇲🇲",
    "Nepali": "🇳🇵",
    "Norwegian": "🇳🇴",
    "Odia (Oriya)": "🇮🇳",
    "Pashto": "🇵🇰",
    "Persian": "🇮🇷",
    "Polish": "🇵🇱",
    "Portuguese": "🇵🇹",
    "Punjabi": "🇮🇳",
    "Romanian": "🇷🇴",
    "Russian": "🇷🇺",
    "Samoan": "🇼🇸",
    "Serbian": "🇷🇸",
    "Sesotho": "🇱🇸",
    "Shona": "🇿🇼",
    "Sindhi": "🇮🇳",
    "Sinhala": "🇱🇰",
    "Slovak": "🇸🇰",
    "Slovenian": "🇸🇮",
    "Somali": "🇸🇴",
    "Spanish": "🇪🇸",
    "Sundanese": "🇮🇩",
    "Swahili": "🇹🇿",
    "Swedish": "🇸🇪",
    "Tajik": "🇹🇯",
    "Tamil": "🇮🇳",
    "Tatar": "🇷🇺",
    "Telugu": "🇮🇳",
    "Thai": "🇹🇭",
    "Turkish": "🇹🇷",
    "Turkmen": "🇹🇲",
    "Ukrainian": "🇺🇦",
    "Urdu": "🇵🇰",
    "Uyghur": "🇨🇳",
    "Uzbek": "🇺🇿",
    "Vietnamese": "🇻🇳",
    "Xhosa": "🇿🇦",
    "Yiddish": "🇮🇱",
    "Yoruba": "🇳🇬",
    "Zulu": "🇿🇦"
};
