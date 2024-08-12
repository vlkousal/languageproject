from datetime import timedelta
from random import randint
from django.contrib.sessions.models import Session
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.utils.crypto import get_random_string
from .models import Language, VocabularySet, WordEntry, WordRecord
from utils import Mode

@api_view(['POST'])
def edit_vocab(request):
    session_id = request.data.get('session_id')
    previous_url = request.data.get('previous_url')
    username = Session.objects.get(session_key=session_id).session_data
    user = User.objects.get(username=username)
    author = VocabularySet.objects.get(url=previous_url).author
    vocab_set = VocabularySet.objects.get(url=previous_url)
    if author != user:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    vocab_set.name = request.data.get("name")
    vocab_set.description = request.data.get("description")
    vocab_set.url = request.data.get("url")
    vocab_set.first_language = Language.objects.get(
        name=request.data.get("first_language"))
    vocab_set.second_language = Language.objects.get(
        name=request.data.get("second_language"))
    vocab_set.save()
    vocab_set.vocabulary.clear()
    set_vocabulary(vocab_set, request.data.get("vocabulary"),
                   vocab_set.first_language, vocab_set.second_language, user)
    return Response(status=status.HTTP_200_OK)


@api_view(["POST"])
def add_result(request):
    token = request.data.get("token")
    correct = request.data.get("correct")
    mode = request.data.get("mode")

    try:
        username = Session.objects.get(session_key=token).session_data
        user = User.objects.get(username=username)
    except ObjectDoesNotExist:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    try:
        word = WordEntry.objects.get(id=request.data.get("wordId"))
    except ObjectDoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    filter = WordRecord.objects.filter(user=user, word=word)
    if len(filter) == 0:
        record = WordRecord.objects.create(user=user, word=word)
    else:
        record = WordRecord.objects.get(user=user, word=word)

    if mode == Mode.ONE_OF_THREE.value:
        record.one_of_three_correct += correct
        record.one_of_three_count += 1
    record.save()
    return Response(status=status.HTTP_200_OK)


@api_view(['DELETE'])
def delete_set(request):
    token = request.data.get("token")
    url_to_delete = request.data.get("url_to_delete")
    try:
        username = Session.objects.get(session_key=token).session_data
    except ObjectDoesNotExist:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    try:
        set_to_delete = VocabularySet.objects.get(
            url=url_to_delete,
            author__username=username)
        set_to_delete.delete()
    except ObjectDoesNotExist:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["POST"])
def get_own_sets(request):
    token = request.data.get("token")
    try:
        username = Session.objects.get(session_key=token).session_data
    except ObjectDoesNotExist:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    user = User.objects.get(username=username)
    json = {"sets": []}

    for vocab_set in VocabularySet.objects.filter(author=user):
        set_json = {"name": vocab_set.name, "url": vocab_set.url, "first_language": vocab_set.first_language.name,
                    "second_language": vocab_set.second_language.name}
        json["sets"].append(set_json)
    return Response(status=status.HTTP_200_OK, data=json)


@api_view(['POST'])
def check_token(request):
    token = request.data.get('token')
    try:
        session = Session.objects.get(session_key=token)
    except ObjectDoesNotExist:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    session = Session.objects.get(session_key=token)
    username = session.session_data
    return Response(username, status=status.HTTP_200_OK)


def check_sessions():
    for session in Session.objects.all():
        if session.expire_date < timezone.now():
            session.delete()


@api_view(["POST"])
def get_language_vocab(request):
    first_language = request.data.get("first_language")
    second_language = request.data.get("second_language")

    entries = (WordEntry.objects.filter(first_language__name=first_language,
                                        second_language__name=second_language)
               .values("first", "phonetic", "second"))
    word_list = [{"first": entry["first"], "phonetic": entry["phonetic"],
                  "second": entry["second"]}
                 for entry in entries]
    json = {"words": word_list}
    return Response(status=status.HTTP_200_OK, data=json)


@api_view(["GET"])
def get_vocab_sets(request):
    sets = VocabularySet.objects.all().order_by("-id")

    data = [{"name": s.name, "url": s.url,
             "first_language": s.first_language.name,
             "second_language": s.second_language.name}
            for s in sets]
    return Response(data, status=status.HTTP_200_OK)


@api_view(["POST"])
def get_vocab(request):
    url = request.data.get("url")
    try:
        vocab = VocabularySet.objects.get(url=url)
    except VocabularySet.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    words = []
    for word in vocab.vocabulary.all():
        word = {"question": word.first, "phonetic": word.phonetic, "correct": word.second,
                "id": word.id}
        words.append(word)

    data = {
        "name": vocab.name,
        "author": vocab.author.username,
        "description": vocab.description,
        "first_language": vocab.first_language.name,
        "second_language": vocab.second_language.name,
        "vocabulary": words
    }
    return Response(data, status=status.HTTP_200_OK)


@api_view(["POST", "PUT"])
def create_vocab(request):
    session_id = request.data.get("session_id")
    session = Session.objects.get(session_key=session_id)
    if session is None:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    user = User.objects.get(username=session.session_data)
    if user is None:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    name: str = request.data.get("name")
    description: str = request.data.get("description")
    url: str = request.data.get("url")

    url_filter = VocabularySet.objects.filter(url=url)
    # url is already used
    if len(url_filter) != 0:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    vocab: str = request.data.get("vocabulary")
    first_language = Language.objects.get(
        name=request.data.get("first_language"))
    second_language = Language.objects.get(
        name=request.data.get("second_language"))
    vocab_set = VocabularySet.objects.create(author=user, name=name,
    description=description, url=url, first_language=first_language,
    second_language=second_language)

    set_vocabulary(vocab_set, vocab, first_language, second_language, user)
    return Response("OK", status=status.HTTP_200_OK)


# TODO - make a file for these files that are not APIs
def set_vocabulary(vocab_set: VocabularySet, vocab_string: str,
                   first_language: Language, second_language: Language,
                   user: User):
    for line in vocab_string.split("\n"):
        if len(line.split(";")) >= 3:
            first = line.split(";")[0]
            phonetic = line.split(";")[1]
            second = line.split(";")[2]

            # the same word might already exist (even with flipped languages)
            filter1 = WordEntry.objects.filter(first_language=first_language,
                                               second_language=second_language,
                                               first=first, phonetic=phonetic,
                                               second=second)
            filter2 = WordEntry.objects.filter(first_language=second_language,
                                               second_language=first_language,
                                               first=second, phonetic=phonetic,
                                               second=first)
            if len(filter1) > 0:
                vocab_set.vocabulary.add(filter1.first())
                continue
            elif len(filter2) > 0:
                vocab_set.vocabulary.add(filter2.first())
                continue
            word = WordEntry.objects.create(contributor=user,
                                            first_language=first_language,
                                            second_language=second_language,
                                            first=first,
                                            phonetic=phonetic, second=second)
            vocab_set.vocabulary.add(word)
    vocab_set.save()


@api_view(["GET"])
def get_languages(request):
    languages = Language.objects.all()
    d = {}
    for language in languages:
        d[language.name] = language.id
    return Response(d, status=status.HTTP_200_OK)


@api_view(['POST', "PUT"])
def register(request):
    username = request.data.get("username")
    password = request.data.get("password")
    existing = User.objects.filter(username=username)
    if existing.exists():
        return Response(status=status.HTTP_400_BAD_REQUEST)
    key = generate_key()
    Session.objects.create(expire_date=timezone.now() + timedelta(weeks=2),
                           session_key=key, session_data=username)
    User.objects.create_user(username=username, password=password)
    return Response(key, status=status.HTTP_200_OK)


@api_view(["POST", "PUT"])
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    existing = User.objects.filter(username=username)
    if not existing.exists():
        return Response(status=status.HTTP_400_BAD_REQUEST)
    user = User.objects.get(username=username)
    if not user.check_password(password):
        return Response(status=status.HTTP_400_BAD_REQUEST)
    key = generate_key()
    Session.objects.create(expire_date=timezone.now() + timedelta(weeks=2),
                           session_key=key,
                           session_data=username)
    return Response(key, status=status.HTTP_200_OK)


def generate_key():
    return get_random_string(length=randint(4000, 4097))
