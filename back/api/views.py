from db_config import URL, KEY
from supabase import create_client, Client
from typing import List, Dict
from django.contrib.sessions.models import Session
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.utils.crypto import get_random_string
from .models import Language, VocabularySet, WordEntry, WordRecord, VocabularySetRecord, VocabularyUserRelationship
from django.contrib.auth.hashers import make_password, check_password

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
    token: str = request.data.get("token")
    previous_url: str = request.data.get("url")
    user: User = get_user(token)

    try:
        author = VocabularySet.objects.get(url=previous_url).author
    except ObjectDoesNotExist:
        print("primo tady qqplot")

    try:
        vocab_set = VocabularySet.objects.get(url=previous_url)
    except ObjectDoesNotExist:
        print("nn tady brasko")

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
    set_vocabulary(vocab_set, user, request.data.get("vocabulary"))
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


@api_view(["POST"])
def check_token(request):
    token = request.data.get("token")
    supabase: Client = create_client(URL, KEY)

    response = supabase.table("session").select("user_id").eq("session_key", token).limit(1).execute()
    if len(response.data) == 0:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    user_id: int = response.data[0].get("user_id")
    response = supabase.table("user").select("username").eq("id", user_id).single().execute()
    username: str = response.data.get("username")
    return Response(status=status.HTTP_200_OK, data={"username": username})


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
    supabase: Client = create_client(URL, KEY)

    sets = supabase.table("vocabulary_set").select("*").order("id").execute()

    data = []
    for vocab_set in sets.data:
        first_language = (supabase.table("language")
                          .select("name").eq("id", vocab_set["first_language_id"])
                          .single().execute())
        second_language = (supabase.table("language")
                           .select("name").eq("id", vocab_set["second_language_id"]).single().execute())

        json = {
            "name": vocab_set["name"],
            "url": vocab_set["url"],
            "first_language": first_language.data["name"],
            "second_language": second_language.data["name"]
        }
        data.append(json)
    return Response(data, status=status.HTTP_200_OK)


@api_view(["POST"])
def get_vocab(request):
    token = request.data.get("token")
    url = request.data.get("url")

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


def get_user_id_from_token(client: Client, token: str) -> int or None:
    response = client.table("session").select("user_id").eq("session_key", token).limit(1).execute()
    if len(response.data) == 0:
        return None
    return response.data[-1].get("user_id")


@api_view(["POST", "PUT"])
def create_vocab(request):
    token: str = request.data.get("token")
    name: str = request.data.get("name")
    url: str = request.data.get("url")
    description: str = request.data.get("description")
    vocabulary: List[Dict[str, str]] = request.data.get("vocabulary")
    first: str = request.data.get("first_language")
    second: str = request.data.get("second_language")
    supabase: Client = create_client(URL, KEY)

    user_id: int = get_user_id_from_token(supabase, token)
    if user_id is None:
        return Response(status=status.HTTP_401_UNAUTHORIZED, data={"message": "Session invalid."})

    url_filter = supabase.table("vocabulary_set").select("*").eq("url", url).execute()
    # url is already used
    if len(url_filter.data) != 0:
        return Response(status=status.HTTP_400_BAD_REQUEST, data="This URL is already used. Please use another one.")

    first_id = supabase.table("language").select("id").eq("name", first).single().execute().data.get("id")
    second_id = supabase.table("language").select("id").eq("name", second).single().execute().data.get("id")

    # create the set itself
    response = supabase.table("vocabulary_set").insert(
        {
            "contributor_id": user_id,
            "name": name,
            "description": description,
            "url": url,
            "first_language_id": first_id,
            "second_language_id": second_id
         }
    ).execute()
    set_id: int = response.data[-1].get("id")
    create_entries(supabase, vocabulary, set_id, user_id)
    return Response(status=status.HTTP_200_OK)


def create_entries(client: Client, vocabulary: List[Dict[str, str]], set_id: int, user_id: int) -> None:
    for word in vocabulary:
        # the same word already exists, and thus there is no reason to create it anymore
        filter1 = (client.table("word_entry").select("*")
                   .eq("first", word["first"])
                   .eq("phonetic", word["phonetic"])
                   .eq("second", word["second"])).limit(1).execute()
        if len(filter1.data) != 0:
            client.table("vocabulary_set_word_entry").insert(
                {"set_id": set_id, "word_id": filter1.data[-1].get("id")}
            ).execute()
            continue
        creation_result = client.table("word_entry").insert({
            "contributor": user_id,
            "first": word["first"],
            "phonetic": word["phonetic"],
            "second": word["second"]
        }).execute()
        word_id: int = creation_result.data[-1].get("id")
        client.table("vocabulary_set_word_entry").insert(
            {"set_id": set_id, "word_id": word_id}
        ).execute()

def set_vocabulary(vocab_set: VocabularySet, user_id: int, vocabulary: List[Dict[str, str]], client: Client):
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


@api_view(["POST"])
def register(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")
    supabase: Client = create_client(URL, KEY)
    if user_exists(supabase, username):
        return Response(status=status.HTTP_400_BAD_REQUEST, data="This username is already used.")

    if email_exists(supabase, email):
        return Response(status=status.HTTP_400_BAD_REQUEST, data="This email is already used.")

    user_creation_result = (
        supabase.table("user")
        .insert({"username": username, "email": email, "password": make_password(password)})
        .execute()
    )

    id: int = int(user_creation_result.data[0].get("id"))
    key = generate_token()
    supabase.table("session").insert({"session_key": key, "user_id": id}).execute()
    return Response(data={"token": key}, status=status.HTTP_200_OK)


@api_view(["POST"])
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    supabase: Client = create_client(URL, KEY)

    if not user_exists(supabase, username):
        return Response(status=status.HTTP_400_BAD_REQUEST)

    response = supabase.table("user").select("password", "id").eq("username", username).single().execute()
    if not check_password(password, response.data.get("password")):
        return Response(status=status.HTTP_400_BAD_REQUEST)

    key: str = generate_token()
    id: int = response.data.get("id")
    supabase.table("session").insert({"session_key": key, "user_id": id}).execute()
    return Response(data={"token": key}, status=status.HTTP_200_OK)


@api_view(["POST"])
def logout(request):
    token = request.data
    supabase: Client = create_client(URL, KEY)
    supabase.table("session").delete().eq("session_key", token).execute()
    return Response(status=status.HTTP_200_OK)


def user_exists(client: Client, username: str) -> bool:
    return len(client.table("user").select("*").eq("username", username).execute().data) != 0


def email_exists(client: Client, email: str) -> bool:
    return len(client.table("user").select("*").eq("email", email).execute().data) != 0


def generate_token():
    return get_random_string(128)

