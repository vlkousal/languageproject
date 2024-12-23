import os
from typing import List

import django
from django.core.exceptions import ObjectDoesNotExist

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "languageproject_back.settings")
django.setup()

from api.models import Language, ForumCategory


counter: int = 0

with open("languages.txt", "r") as content:
    for line in content.readlines():
        language: str = line.strip()
        fltr = Language.objects.filter(name=language)
        if len(fltr) == 0:
            language: str = line.strip()
            counter += 1
            Language.objects.create(name=language)

print("Added", counter, " langauges to the database.")

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

import GPT4all
