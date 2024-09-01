from django.contrib import admin
from .models import Language, WordEntry, VocabularySet, WordRecord, VocabularySetRecord, VocabularyUserRelationship

# Register your models here.
admin.site.register(Language)
admin.site.register(WordEntry)
admin.site.register(VocabularySet)
admin.site.register(WordRecord)
admin.site.register(VocabularyUserRelationship)


class VocabularySetRecordAdmin(admin.ModelAdmin):
    list_display = ('user', 'set', 'date', 'score')
    readonly_fields = ('date',)

admin.site.register(VocabularySetRecord, VocabularySetRecordAdmin)
