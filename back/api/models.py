from django.db import models
from django.contrib.auth.models import User


class Language(models.Model):
    name = models.CharField(max_length=64)

    def __str__(self):
        return self.name


class WordEntry(models.Model):
    contributor = models.ForeignKey(User, on_delete=models.CASCADE)
    first_language = models.ForeignKey(Language,
                                       on_delete=models.CASCADE,
                                       related_name="word_language")
    second_language = models.ForeignKey(Language,
                                        on_delete=models.CASCADE,
                                        related_name="translation_language")
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
    correct = models.IntegerField(default=0)
    count = models.IntegerField(default=0)

    def __str__(self):
        return (self.user.username + " - " + self.word.first +
                "(" + self.word.second + ")" + " " +
                str(self.correct) + "/" + str(self.count))
