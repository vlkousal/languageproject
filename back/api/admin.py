from django.contrib import admin
from .models import Language, WordEntry, VocabularySet, WordRecord

# Register your models here.
admin.site.register(Language)
admin.site.register(WordEntry)
admin.site.register(VocabularySet)
admin.site.register(WordRecord)
