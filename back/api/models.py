from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _


class Language(models.Model):
    name = models.CharField(max_length=64)

    def __str__(self):
        return self.name


class WordEntry(models.Model):
    contributor = models.ForeignKey(User, on_delete=models.CASCADE)
    first = models.CharField(max_length=64)
    phonetic = models.CharField(max_length=64)
    second = models.CharField(max_length=64)

    def __str__(self):
        return self.first + " - " + self.phonetic + " - " + self.second


class VocabularySet(models.Model):
    name = models.CharField(max_length=64)
    description = models.CharField(max_length=256)
    url = models.CharField(max_length=32)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    first_language = models.ForeignKey(Language,
                                       on_delete=models.CASCADE,
                                       related_name="set_first_language")
    second_language = models.ForeignKey(Language,
                                        on_delete=models.CASCADE,
                                        related_name="set_second_language")
    vocabulary = models.ManyToManyField(WordEntry)

    def __str__(self):
        return self.name


class WordRecord(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    word = models.ForeignKey(WordEntry, on_delete=models.CASCADE)

    one_of_three_score = models.IntegerField(default=0)
    one_of_three_streak = models.IntegerField(default=0)
    write_the_answer_score = models.IntegerField(default=0)
    write_the_answer_streak = models.IntegerField(default=0)
    draw_character_score = models.IntegerField(default=0)
    draw_character_streak = models.IntegerField(default=0)

    def __str__(self):
        return (self.user.username + " - " + self.word.first +
                "(" + self.word.second + ")")


class VocabularySetRecord(models.Model):
    class Mode(models.TextChoices):
        ONE_OF_THREE = 0, _('One Of Three')
        WRITE_THE_ANSWER = 1, _('Write The Answer')
        FLASHCARDS = 2, _("Flashcards")
        DRAW_CHARACTER = 3, _('Draw Characters')

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    set = models.ForeignKey(VocabularySet, on_delete=models.CASCADE)
    mode = models.CharField(choices=Mode.choices, default=Mode.ONE_OF_THREE, max_length=16)
    date = models.DateTimeField(auto_now_add=True)
    score = models.IntegerField(default=0)

    def __str__(self):
        return self.user.username + " - " + self.set.name + "(" + str(self.score) + ")"


class VocabularyUserRelationship(models.Model):
    class Rating(models.TextChoices):
        LIKED = 1, _("Liked")
        NONE = 0, _("None")
        DISLIKED = -1, _("Disliked")

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    set = models.ForeignKey(VocabularySet, on_delete=models.CASCADE)
    rating = models.CharField(choices=Rating.choices, default=Rating.NONE, max_length=16)
    saved = models.BooleanField(default=False)

    def __str__(self):
        return self.set.name + " - " + self.user.username

