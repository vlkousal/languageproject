import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "languageproject_back.settings")
django.setup()

from api.models import Language


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
