from enum import Enum

from django.forms import models


class Mode(Enum):
    ONE_OF_THREE = 0
    WRITE_THE_ANSWER = 1
