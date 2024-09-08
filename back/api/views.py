import this
from datetime import timedelta
from typing import List, Dict
from django.contrib.sessions.models import Session
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.utils.crypto import get_random_string
from .models import Language, VocabularySet, WordEntry, WordRecord, VocabularySetRecord, VocabularyUserRelationship


@api_view(['POST'])
def get_high_score(request):
    token: str = request.data.get("token")
    vocab_url: str = request.data.get("url")
    mode: int = request.data.get("mode")

    user: User = get_user(token)
    if user is None:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    try:
        vocab_set: VocabularySet = VocabularySet.objects.get(url=vocab_url)
    except ObjectDoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    if mode is None:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    highest_score_set = VocabularySetRecord.objects.filter(user=user, set=vocab_set, mode=str(mode)).order_by(
    '-score').first()
    if highest_score_set is None:
        return Response(data={"highScore": -1}, status=status.HTTP_200_OK)
    return Response(data={"highScore": highest_score_set.score}, status=status.HTTP_200_OK)


@api_view(['POST'])
def get_username(request):
    token: str = request.data.get("token")
    username: str = Session.objects.get(session_key=token).session_data
    return Response(data={"username": username}, status=status.HTTP_200_OK)


def get_user(token: str):
    try:
        username: str = Session.objects.get(session_key=token).session_data
        user = User.objects.get(username=username)
        return user
    except ObjectDoesNotExist:
        return None


@api_view(["POST"])
def get_save_status(request):
    token: str = request.data.get("token")
    user: User = get_user(token)

    if user is None:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    url: str = request.data.get("url")
    vocab_set: VocabularySet = get_object_or_404(VocabularySet, url=url)

    save_status: bool = False
    try:
        relationship: VocabularyUserRelationship = VocabularyUserRelationship.objects.get(user=user, set=vocab_set)
        save_status = relationship.saved
    except ObjectDoesNotExist:
        pass
    return Response(status=status.HTTP_200_OK, data={"status": save_status})

@api_view(["POST"])
def save_set(request):
    token: str = request.data.get("token")
    user: User = get_user(token)
    if user is None:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    url: str = request.data.get("url")
    vocab_set = VocabularySet.objects.get(url=url)
    if vocab_set is None:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    is_saved: bool = request.data.get("isSaved")
    vocab_set: VocabularySet = VocabularySet.objects.get(url=url)
    try:
        relationship: VocabularyUserRelationship = VocabularyUserRelationship.objects.get(user=user, set=vocab_set)
        relationship.saved = not(is_saved)
    except ObjectDoesNotExist:
        relationship: VocabularyUserRelationship = VocabularyUserRelationship.objects.create(user=user, set=vocab_set, saved=True)
    relationship.save()
    return Response(status=status.HTTP_200_OK)


@api_view(['POST'])
def edit_vocab(request):
    token = request.data.get("token")
    previous_url = request.data.get("previous_url")
    username = Session.objects.get(session_key=token).session_data
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


@api_view(['POST'])
def send_vocab_result(request):
    token: str = request.data.get("token")
    set_url = request.data.get("setUrl")
    score = request.data.get("score")
    mode: str = request.data.get("mode")

    try:
        username = Session.objects.get(session_key=token).session_data
        user = User.objects.get(username=username)
    except ObjectDoesNotExist:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    try:
        vocab_set = VocabularySet.objects.get(url=set_url)
    except ObjectDoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    if score is None:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    VocabularySetRecord.objects.create(user=user, set=vocab_set, score=score, mode=str(mode)).save()
    return Response(status=status.HTTP_200_OK)


@api_view(["POST"])
def add_result(request):
    token = request.data.get("token")
    correct = request.data.get("correct")
    mode = request.data.get("mode")
    word_id = request.data.get("wordId")

    if token is None or correct is None or mode is None or word_id is None:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    try:
        username = Session.objects.get(session_key=token).session_data
        user = User.objects.get(username=username)
    except ObjectDoesNotExist:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    try:
        word = WordEntry.objects.get(id=word_id)
    except ObjectDoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if mode is None:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    filtered = WordRecord.objects.filter(user=user, word=word)
    if not filtered.exists():
        record = WordRecord.objects.create(user=user, word=word)
        record.save()
    else:
        record = filtered.first()

    if str(mode) == VocabularySetRecord.Mode.ONE_OF_THREE:
        if correct:
            new_score: int = record.one_of_three_score + 10 + record.one_of_three_streak
            record.one_of_three_score = 100 if new_score > 100 else new_score
            record.one_of_three_streak += 1
        else:
            record.one_of_three_score = 0 if record.one_of_three_score - 10 < 0 else record.one_of_three_score - 10
            record.one_of_three_streak = 0
    elif str(mode) == VocabularySetRecord.Mode.WRITE_THE_ANSWER:
        if correct:
            new_score: int = record.write_the_answer_score + 10 + record.write_the_answer_score
            record.write_the_answer_score = 100 if new_score > 100 else new_score
            record.write_the_answer_streak += 1
        else:
            record.write_the_answer_score = 0 if record.write_the_answer_score - 10 < 0 else record.write_the_answer_score - 10
            record.write_the_answer_streak = 0
    elif str(mode) == VocabularySetRecord.Mode.DRAW_CHARACTER:
        if correct:
            new_score: int = record.draw_character_score + 10 + record.draw_character_score
            record.draw_character_score = 100 if new_score > 100 else new_score
            record.draw_character_streak += 1
        else:
            record.draw_character_score = 0 if record.draw_character_score - 10 < 0 else record.draw_character_score - 10
            record.draw_character_streak = 0
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
        return Response(status=status.HTTP_404_NOT_FOUND)
    return Response(status=status.HTTP_200_OK)


@api_view(["POST"])
def get_own_sets(request):
    token: str = request.data.get("token")

    user: User = get_user(token)
    if user is None:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    json = {"sets": []}

    for vocab_set in VocabularySet.objects.filter(author=user):
        set_json = {"name": vocab_set.name, "url": vocab_set.url, "first_language": vocab_set.first_language.name,
                    "second_language": vocab_set.second_language.name, "is_own": True}
        json["sets"].append(set_json)

    for relationship in VocabularyUserRelationship.objects.filter(user=user, saved=True):
        vocab_set: VocabularySet = relationship.set
        set_json = {"name": vocab_set.name, "url": vocab_set.url, "first_language": vocab_set.first_language.name,
                  "second_language": vocab_set.second_language.name, "is_own": False}
        json["sets"].append(set_json)
    return Response(status=status.HTTP_200_OK, data=json)


@api_view(['POST', "OPTIONS"])
def check_token(request):
    token = request.data.get('token')
    try:
        session = Session.objects.get(session_key=token)
    except ObjectDoesNotExist:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    username = session.session_data
    return Response(data={"username": username }, status=status.HTTP_200_OK)


def check_sessions():
    for session in Session.objects.all():
        if session.expire_date < timezone.now():
            session.delete()


@api_view(["POST"])
def get_language_vocab(request):
    first = request.data.get("first_language")
    second = request.data.get("second_language")

    sets = VocabularySet.objects.filter(first_language__name=first, second_language__name=second)
    words: List[Dict[str, str]] = []
    for s in sets:
        for word in s.vocabulary.all():
            words.append({"first": word.first, "phonetic": word.phonetic, "second": word.second})
    return Response(status=status.HTTP_200_OK, data={"words": words})


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
    token = request.data.get("token")
    url = request.data.get("url")

    no_user: bool = True
    try:
        username: str = Session.objects.get(session_key=token).session_data
        user = User.objects.get(username=username)
        no_user = False
    except ObjectDoesNotExist:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    try:
        vocab = VocabularySet.objects.get(url=url)
    except VocabularySet.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    words = []
    for word in vocab.vocabulary.all():
        # getting the scores
        scores: List[int] = [0 for i in range(len(VocabularySetRecord.Mode.choices))]
        if not no_user:
            try:
                record = WordRecord.objects.get(user=user, word=word)
                scores[0] = record.one_of_three_score
                scores[int(VocabularySetRecord.Mode.ONE_OF_THREE.value)] = record.one_of_three_score
                scores[int(VocabularySetRecord.Mode.WRITE_THE_ANSWER.value)] = record.write_the_answer_score
                scores[int(VocabularySetRecord.Mode.DRAW_CHARACTER.value)] = record.draw_character_score
            except ObjectDoesNotExist:
                pass


        word = {"question": word.first,
                "phonetic": word.phonetic,
                "correct": word.second,
                "id": word.id,
                "scores": scores
                }
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
    token: str = request.data.get("token")
    name: str = request.data.get("name")
    url: str = request.data.get("url")
    description: str = request.data.get("description")
    vocabulary = request.data.get("vocabulary")

    session = Session.objects.get(session_key=token)
    if session is None:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    user = User.objects.get(username=session.session_data)
    if user is None:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    url_filter = VocabularySet.objects.filter(url=url)
    # url is already used
    if len(url_filter) != 0:
        return Response(status=status.HTTP_400_BAD_REQUEST, data="This URL is already used. Please use another one.")

    first_language = Language.objects.get(
        name=request.data.get("first_language"))
    second_language = Language.objects.get(
        name=request.data.get("second_language"))

    vocab_set = VocabularySet.objects.create(author=user, name=name,
    description=description, url=url, first_language=first_language,
    second_language=second_language)

    set_vocabulary(vocab_set, user, vocabulary)
    return Response("OK", status=status.HTTP_200_OK)


def set_vocabulary(vocab_set: VocabularySet, user: User, vocabulary: List[Dict[str, str]]):
    for word in vocabulary:
        # the same word might already exist (even with flipped languages)
        filter1 = WordEntry.objects.filter(first=word["first"], phonetic=word["phonetic"],
                                           second=word["second"])
        filter2 = WordEntry.objects.filter(first=word["second"], phonetic=word["phonetic"],
                                           second=word["first"])
        if len(filter1) > 0:
            vocab_set.vocabulary.add(filter1.first())
            continue
        elif len(filter2) > 0:
            vocab_set.vocabulary.add(filter2.first())
            continue
        word = WordEntry.objects.create(contributor=user, first=word["first"], phonetic=word["phonetic"],
                                        second=word["second"])
        vocab_set.vocabulary.add(word)
    vocab_set.save()


@api_view(["GET"])
def get_languages(request):
    languages = Language.objects.all()
    lang_list = []
    for language in languages:
        lang_list.append(language.name)
    return Response(data={"languages": lang_list}, status=status.HTTP_200_OK)


@api_view(['POST', "PUT"])
def register(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")
    existing = User.objects.filter(username=username)
    if existing.exists():
        return Response(status=status.HTTP_400_BAD_REQUEST)
    key = generate_key()
    Session.objects.create(expire_date=timezone.now() + timedelta(weeks=2),
                           session_key=key, session_data=username)
    User.objects.create_user(username=username, email=email, password=password)
    return Response(data={"token": key}, status=status.HTTP_200_OK)


@api_view(["POST"])
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

    Session.objects.create(expire_date=timezone.now() + timedelta(weeks=4),
                           session_key=key,
                           session_data=username)
    return Response(data={"token": key}, status=status.HTTP_200_OK)


def generate_key():
    return get_random_string(512)
