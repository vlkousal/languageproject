from django.db import models
from django.utils.translation import gettext_lazy as _

from languageproject_back import settings
from users.models import User


class Language(models.Model):
    name = models.CharField(max_length=64)
    alpha2 = models.CharField(max_length=2)

    def __str__(self):
        return self.name + "(" + self.alpha2 + ")"

class WordEntry(models.Model):
    contributor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    word = models.CharField(max_length=64)
    phonetic = models.CharField(max_length=64)
    translation = models.CharField(max_length=64)

    def __str__(self):
        return self.word + " - " + self.phonetic + " - " + self.translation


class VocabularySetCategory(models.Model):
    name = models.CharField(max_length=16)
    fa_icon = models.CharField(max_length=16)

    def __str__(self):
        return self.name


class VocabularySet(models.Model):
    name = models.CharField(max_length=64)
    description = models.CharField(max_length=256)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    language = models.ForeignKey(Language, on_delete=models.CASCADE)
    category = models.ForeignKey(VocabularySetCategory, on_delete=models.CASCADE)
    vocabulary = models.ManyToManyField(WordEntry)

    def __str__(self):
        return self.name


class WordRecord(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    word = models.ForeignKey(WordEntry, on_delete=models.CASCADE)

    one_of_three_score = models.IntegerField(default=0)
    one_of_three_streak = models.IntegerField(default=0)
    write_the_answer_score = models.IntegerField(default=0)
    write_the_answer_streak = models.IntegerField(default=0)
    draw_character_score = models.IntegerField(default=0)
    draw_character_streak = models.IntegerField(default=0)

    def __str__(self):
        return (self.user.username + " - " + self.word.word +
                "(" + self.word.translation + ")")


class VocabularySetRecord(models.Model):
    class Mode(models.TextChoices):
        ONE_OF_THREE = "0", _('One Of Three')
        WRITE_THE_ANSWER = "1", _('Write The Answer')
        FLASHCARDS = "2", _("Flashcards")
        DRAW_CHARACTER = "3", _('Draw Characters')

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    set = models.ForeignKey(VocabularySet, on_delete=models.CASCADE)
    mode = models.CharField(choices=Mode.choices, default=Mode.ONE_OF_THREE, max_length=16)
    date = models.DateTimeField(auto_now_add=True)
    score = models.IntegerField(default=0)

    def __str__(self):
        return self.user.username + " - " + self.set.name + "(" + str(self.score) + ")"


class VocabularyUserRelationship(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    set = models.ForeignKey(VocabularySet, on_delete=models.CASCADE)
    saved = models.BooleanField(default=False)

    def __str__(self):
        saved_status: str = "T" if self.saved else "F"
        return self.set.name + " - " + self.user.username + "(" + saved_status + ")"
