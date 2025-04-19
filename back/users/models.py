from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    bio = models.CharField(max_length=256, blank=True)
    location = models.CharField(max_length=32, blank=True)
