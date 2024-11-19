from django.contrib import admin
from .models import Language, WordEntry, VocabularySet, WordRecord, VocabularySetRecord, VocabularyUserRelationship, User

# Register your models here.
admin.site.register(Language)
admin.site.register(WordEntry)
admin.site.register(VocabularySet)
admin.site.register(WordRecord)
admin.site.register(VocabularyUserRelationship)
admin.site.register(User)

class VocabularySetRecordAdmin(admin.ModelAdmin):
    list_display = ('user', 'set', 'date', 'score')
    readonly_fields = ('date',)

admin.site.register(VocabularySetRecord, VocabularySetRecordAdmin)
