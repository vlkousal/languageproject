import os
from typing import List

import django
from django.core.exceptions import ObjectDoesNotExist

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "languageproject_back.settings")
django.setup()

from api.models import Language, VocabularySetCategory


counter: int = 0

with open("languages.txt", "r") as content:
    for line in content.readlines():
        line = line.strip()
        language_name: str = line.split(", ")[0]
        language_code: str = line.split(", ")[1]

        fltr = Language.objects.filter(name=language_name)
        if len(fltr) == 0:
            counter += 1
            Language.objects.create(name=language_name, alpha2=language_code)

print("Added", counter, " langauges to the database.")
counter = 0

with open("categories.txt", "r") as content:
    for line in content.readlines():
        line = line.strip()
        category_name: str = line.split(", ")[0]
        category_icon: str = line.split(", ")[1]

        fltr = VocabularySetCategory.objects.filter(name=category_name, fa_icon=category_icon)
        if len(fltr) == 0:
            counter += 1
            VocabularySetCategory.objects.create(name=category_name, fa_icon=category_icon)

print("Added", counter, " vocabulary set categories to the database.")

"""
basic_categories: List[str] = ["General", "Off-Topic", "News", "Suggestions & Ideas", "Languages"]
languages_category_id = -1

for category in basic_categories:
    fltr = ForumCategory.objects.filter(name=category)
    if len(fltr) == 0:
        created_category = ForumCategory.objects.create(name=category)
        if category == "Languages":
            languages_category_id = created_category.id


try:
    languages_category_id = ForumCategory.objects.get(name="Languages").id
except ObjectDoesNotExist:
    print("Could not create the languages Forum Category!")
    exit()
for language in Language.objects.all():
    if languages_category_id != -1:
        ForumCategory.objects.create(name=language.name, supercategory_id=languages_category_id)
"""
