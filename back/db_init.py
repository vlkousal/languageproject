import os
from token import EXACT_TOKEN_TYPES

import django
from postgrest.types import CountMethod

from db_config import URL, KEY
from supabase import create_client, Client

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "languageproject_back.settings")
django.setup()

from api.models import Language

languages = [
    "Afrikaans",
    "Albanian",
    "Amharic",
    "Arabic",
    "Armenian",
    "Azerbaijani",
    "Basque",
    "Belarusian",
    "Bengali",
    "Bosnian",
    "Bulgarian",
    "Catalan",
    "Cebuano",
    "Chichewa",
    "Chinese (Simplified)",
    "Chinese (Traditional)",
    "Corsican",
    "Croatian",
    "Czech",
    "Danish",
    "Dutch",
    "English",
    "Esperanto",
    "Estonian",
    "Filipino",
    "Finnish",
    "French",
    "Frisian",
    "Galician",
    "Georgian",
    "German",
    "Greek",
    "Gujarati",
    "Haitian Creole",
    "Hausa",
    "Hawaiian",
    "Hebrew",
    "Hindi",
    "Hmong",
    "Hungarian",
    "Icelandic",
    "Igbo",
    "Indonesian",
    "Irish",
    "Italian",
    "Japanese",
    "Javanese",
    "Kannada",
    "Kazakh",
    "Khmer",
    "Kinyarwanda",
    "Korean",
    "Kurdish (Kurmanji)",
    "Kyrgyz",
    "Lao",
    "Latin",
    "Latvian",
    "Lithuanian",
    "Luxembourgish",
    "Macedonian",
    "Malagasy",
    "Malay",
    "Malayalam",
    "Maltese",
    "Maori",
    "Marathi",
    "Mongolian",
    "Myanmar (Burmese)",
    "Nepali",
    "Norwegian",
    "Odia (Oriya)",
    "Pashto",
    "Persian",
    "Polish",
    "Portuguese",
    "Punjabi",
    "Romanian",
    "Russian",
    "Samoan",
    "Serbian",
    "Sesotho",
    "Shona",
    "Sindhi",
    "Sinhala",
    "Slovak",
    "Slovenian",
    "Somali",
    "Spanish",
    "Sundanese",
    "Swahili",
    "Swedish",
    "Tajik",
    "Tamil",
    "Tatar",
    "Telugu",
    "Thai",
    "Turkish",
    "Turkmen",
    "Ukrainian",
    "Urdu",
    "Uyghur",
    "Uzbek",
    "Vietnamese",
    "Xhosa",
    "Yiddish",
    "Yoruba",
    "Zulu"
]

create_language_query: str = """
CREATE TABLE language (
    id SERIAL PRIMARY KEY,
    name VARCHAR(32) NOT NULL
);
"""

create_word_entry_query: str = """
CREATE TABLE word_entry (
    id SERIAL PRIMARY KEY,
    first VARCHAR(255) NOT NULL,
    phonetic VARCHAR(255),
    second VARCHAR(255) NOT NULL
);
"""

create_user_query: str = """
CREATE TABLE "user" (
  id SERIAL PRIMARY KEY,
  username VARCHAR(16) NOT NULL,
  email VARCHAR(320) NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"""

create_vocabulary_set_query: str = """
CREATE TABLE "vocabulary_set" (
    id SERIAL PRIMARY KEY,
    contributor_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    url VARCHAR(255),
    first_id INTEGER NOT NULL,
    second_id INTEGER NOT NULL,

    FOREIGN KEY (contributor_id) REFERENCES "user"(id),
    FOREIGN KEY (first_id) REFERENCES language(id),
    FOREIGN KEY (second_id) REFERENCES language(id)
);
"""

create_session_query: str = """
CREATE TABLE session (
  session_key VARCHAR(128) PRIMARY KEY NOT NULL,
  user_id int,
  expiry_time TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '2 weeks'),
  FOREIGN KEY (user_id) REFERENCES "user"(id)
)
"""

create_vocabulary_set_word_entry_query: str = """
CREATE TABLE vocabulary_set_word_entry (
    set_id INTEGER NOT NULL,
    word_id INTEGER NOT NULL,
    PRIMARY KEY (set_id, word_id),
    FOREIGN KEY (set_id) REFERENCES vocabulary_set(id),
    FOREIGN KEY (word_id) REFERENCES word_entry(id)
);
"""

create_word_record_query: str = """
CREATE TABLE "word_record" (
    user_id INTEGER NOT NULL,
    word_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, word_id),
    one_of_three_score INTEGER DEFAULT 0,
    one_of_three_streak INTEGER DEFAULT 0,
    write_the_answer_score INTEGER DEFAULT 0,
    write_the_answer_streak INTEGER DEFAULT 0,
    draw_character_score INTEGER DEFAULT 0,
    draw_character_streak INTEGER DEFAULT 0,

    FOREIGN KEY (user_id) REFERENCES "user"(id),
    FOREIGN KEY (word_id) REFERENCES word_entry(id)
);
"""

create_rating_enum: str = """
CREATE TYPE rating AS ENUM('LIKED', 'NONE', 'DISLIKED');
"""


create_vocabulary_user_relationship_query: str = """
CREATE TABLE vocabulary_user_relationship (
    user_id INTEGER NOT NULL,
    set_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, set_id),
    rating rating,
    saved BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES "user"(id),
    FOREIGN KEY (set_id) REFERENCES vocabulary_set(id)
);
"""

create_mode_enum: str = """
CREATE TYPE mode as ENUM('ONE_OF_THREE', 'WRITE_THE_ANSWER', 'FLASHCARDS', 'DRAW_CHARACTERS');
"""

create_vocabulary_set_record_query: str = """
CREATE TABLE "vocabulary_set_record" (
    user_id INTEGER NOT NULL,
    word_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, word_id),
    mode mode,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    score INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES "user"(id),
    FOREIGN KEY (word_id) REFERENCES word_entry(id)
);
"""


def add_languages() -> None:
    counter: int = 0
    supabase: Client = create_client(URL, KEY)
    for language in languages:
        response = supabase.from_("language").select("*").eq("name", language).execute()
        language_count: int = len(response.data)
        if language_count == 0:
            supabase.table("language").insert({"name": language}).execute()
            counter += 1
    print("Added", counter, "languages to the database.")


add_languages()
