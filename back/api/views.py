from typing import List, Dict
from django.contrib.sessions.models import Session
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import User, Language, VocabularySet, WordEntry, WordRecord, VocabularySetRecord, VocabularyUserRelationship
import base64
import easyocr
from .user_views import get_user


# checks the drawn character
@api_view(['POST'])
def check_image(request):
    image: str = request.data.get("image")
    correct: str = request.data.get("correct")

    # decodes the base64 string
    b = bytes(image.split(",")[1], encoding='utf-8')
    image_data = base64.b64decode(b)
    reader = easyocr.Reader(['ch_sim'])
    result = reader.readtext(image_data)

    for column in result:
        canvas_pos, character, prob = column
        if character == correct:
            return Response(status=status.HTTP_200_OK, data={"result": True})
    return Response(status=status.HTTP_200_OK, data={"result": False})


# returns a high score based on the set and the mode
@api_view(['POST'])
def get_high_score(request):
    token: str = request.data.get("token")
    id: str = request.data.get("id")
    mode: int = request.data.get("mode")

    user: User = get_user(token)

    if user is None:
        return Response(data={"highScore": -1}, status=status.HTTP_200_OK)
    try:
        vocab_set: VocabularySet = VocabularySet.objects.get(id=id)
    except ObjectDoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    if mode is None:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    highest_score_set = VocabularySetRecord.objects.filter(user=user, set=vocab_set, mode=str(mode)).order_by(
    '-score').first()
    if highest_score_set is None:
        return Response(data={"highScore": -1}, status=status.HTTP_200_OK)
    return Response(data={"highScore": highest_score_set.score}, status=status.HTTP_200_OK)


# returns whether a given set is saved by the user
@api_view(["POST"])
def get_save_status(request):
    token: str = request.data.get("token")
    user: User = get_user(token)

    if user is None:
        return Response(status=status.HTTP_200_OK, data={"status": False})

    id: int = request.data.get("id")
    vocab_set: VocabularySet = get_object_or_404(VocabularySet, id=id)

    save_status: bool = False
    try:
        relationship: VocabularyUserRelationship = VocabularyUserRelationship.objects.get(user=user, set=vocab_set)
        save_status = relationship.saved
    except ObjectDoesNotExist:
        pass
    return Response(status=status.HTTP_200_OK, data={"status": save_status})


# saves a set into a user's collection
@api_view(["POST"])
def save_set(request):
    token: str = request.data.get("token")
    user: User = get_user(token)
    if user is None:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    id: int = request.data.get("id")
    vocab_set = VocabularySet.objects.get(id=id)
    if vocab_set is None:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    is_saved: bool = request.data.get("isSaved")
    vocab_set: VocabularySet = VocabularySet.objects.get(id=id)
    try:
        relationship: VocabularyUserRelationship = VocabularyUserRelationship.objects.get(user=user, set=vocab_set)
        relationship.saved = not(is_saved)
    except ObjectDoesNotExist:
        relationship: VocabularyUserRelationship = VocabularyUserRelationship.objects.create(user=user, set=vocab_set, saved=True)
    relationship.save()
    return Response(status=status.HTTP_200_OK)


# edits a vocabulary
@api_view(['POST'])
def edit_vocab(request):
    token: str = request.data.get("token")
    id: str = request.data.get("id")

    user: User = get_user(token)

    try:
        author = VocabularySet.objects.get(id=id).author
    except ObjectDoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    try:
        vocab_set = VocabularySet.objects.get(id=id)
    except ObjectDoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    if author != user:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    vocab_set.name = request.data.get("name")
    vocab_set.description = request.data.get("description")
    vocab_set.language = Language.objects.get(
        name=request.data.get("language"))
    vocab_set.save()
    vocab_set.vocabulary.clear()
    set_vocabulary(vocab_set, user, request.data.get("vocabulary"))
    return Response(status=status.HTTP_200_OK)


# saves the result of a just finished set in a given mode
@api_view(['POST'])
def send_vocab_result(request):
    token: str = request.data.get("token")
    id = request.data.get("id")
    score = request.data.get("score")
    mode: str = request.data.get("mode")

    try:
        username = Session.objects.get(session_key=token).session_data
        user = User.objects.get(username=username)
    except ObjectDoesNotExist:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    try:
        vocab_set = VocabularySet.objects.get(id=id)
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


# deletes a set
@api_view(['DELETE'])
def delete_set(request):
    token = request.data.get("token")
    id = request.data.get("id")
    try:
        username = Session.objects.get(session_key=token).session_data
    except ObjectDoesNotExist:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    try:
        set_to_delete = VocabularySet.objects.get(
            id=id,
            author__username=username)
        set_to_delete.delete()
    except ObjectDoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    return Response(status=status.HTTP_200_OK)


# returns a user's collection
@api_view(["POST"])
def get_own_sets(request):
    token: str = request.data.get("token")

    user: User = get_user(token)
    if user is None:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    json = {"sets": []}

    for vocab_set in VocabularySet.objects.filter(author=user):
        set_json = {"name": vocab_set.name, "id": vocab_set.id,
                    "language": vocab_set.language.name, "is_own": True}
        json["sets"].append(set_json)

    for relationship in VocabularyUserRelationship.objects.filter(user=user, saved=True):
        vocab_set: VocabularySet = relationship.set
        set_json = {"name": vocab_set.name, "id": vocab_set.id,
                    "language": vocab_set.language.name, "is_own": False}
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
    language = request.data.get("language")

    sets = VocabularySet.objects.filter(language__name=language)
    words: List[Dict[str, str]] = []
    for s in sets:
        for word in s.vocabulary.all():
            words.append({"word": word.word, "phonetic": word.phonetic, "translation": word.translation})
    return Response(status=status.HTTP_200_OK, data={"words": words})


# retuns
@api_view(["GET"])
def get_vocab_sets(request):
    sets = VocabularySet.objects.all().order_by("-id")

    data = [{"name": s.name, "id": s.id,
             "language": s.language.name}
            for s in sets]
    return Response(data, status=status.HTTP_200_OK)


# returns a requested /vocab/name vocabulary set
@api_view(["POST"])
def get_vocab(request):
    token = request.data.get("token")
    id = request.data.get("id")

    try:
        session = Session.objects.get(session_key=token)
        username = session.session_data
        is_logged_in = True
    except ObjectDoesNotExist:
        is_logged_in = False

    if is_logged_in:
        try:
           user = User.objects.get(username=username)
           is_logged_in = True
        except ObjectDoesNotExist:
            is_logged_in = False


    try:
        vocab = VocabularySet.objects.select_related(
            'author', 'language').prefetch_related('vocabulary').get(id=id)
    except VocabularySet.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    word_records = {}
    if is_logged_in:
        word_records = {
            record.word_id: record for record in WordRecord.objects.filter(
                user=user,
                word__in=vocab.vocabulary.all()
            )
        }

    words = []
    for word in vocab.vocabulary.all():
        # getting the scores
        scores: List[int] = [-1 for _ in range(len(VocabularySetRecord.Mode.choices))]
        if is_logged_in and word.id in word_records:
            try:
                record = word_records[word.id]
                scores[int(VocabularySetRecord.Mode.ONE_OF_THREE.value)] = record.one_of_three_score
                scores[int(VocabularySetRecord.Mode.WRITE_THE_ANSWER.value)] = record.write_the_answer_score
                scores[int(VocabularySetRecord.Mode.DRAW_CHARACTER.value)] = record.draw_character_score
            except ObjectDoesNotExist:
                scores = [0 for _ in range(len(VocabularySetRecord.Mode.choices))]

        word = {"question": word.word,
                "phonetic": word.phonetic,
                "correct": word.translation,
                "id": word.id,
                "scores": scores
                }
        words.append(word)

    data = {
        "name": vocab.name,
        "author": vocab.author.username,
        "description": vocab.description,
        "language": vocab.language.name,
        "vocabulary": words
    }
    return Response(data, status=status.HTTP_200_OK)


@api_view(["POST", "PUT"])
def create_vocab(request):
    token: str = request.data.get("token")
    name: str = request.data.get("name")
    description: str = request.data.get("description")
    vocabulary = request.data.get("vocabulary")

    session = Session.objects.get(session_key=token)
    if session is None:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    user = User.objects.get(username=session.session_data)
    if user is None:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    language = Language.objects.get(name=request.data.get("language"))

    vocab_set = VocabularySet.objects.create(author=user, name=name,
    description=description, language=language)

    set_vocabulary(vocab_set, user, vocabulary)
    return Response("OK", status=status.HTTP_200_OK)


# a help function that adds words to a newly created vocabulary set
def set_vocabulary(vocab_set: VocabularySet, user: User, vocabulary: List[Dict[str, str]]):
    for word in vocabulary:
        # the same word might already exist
        fltr = WordEntry.objects.filter(word=word["first"], phonetic=word["phonetic"],
                                           translation=word["second"])
        if len(fltr) > 0:
            vocab_set.vocabulary.add(fltr.first())
            continue
        word = WordEntry.objects.create(contributor=user, word=word["first"], phonetic=word["phonetic"],
                                        translation=word["second"])
        vocab_set.vocabulary.add(word)
    vocab_set.save()


# get all languages
@api_view(["GET"])
def get_languages(request):
    languages = {}
    for language in Language.objects.all():
        languages[language.name] = language.alpha2
    return Response(data={"languages": languages}, status=status.HTTP_200_OK)
