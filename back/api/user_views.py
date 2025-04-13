from datetime import timedelta
from django.contrib.sessions.models import Session
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.utils.crypto import get_random_string
from storage3.utils import StorageException
from db_config import SUPABASE_URL, SUPABASE_KEY
from .models import User
import base64
from supabase import create_client, Client

# handles the change of a user's avatar
@api_view(["POST"])
def update_profile_picture(request):
    image: str = request.data.get("image")
    user: User = get_user(request.data.get("token"))

    if user is None:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    b = bytes(image.split(",")[1], encoding='utf-8')
    image_data = base64.b64decode(b)

    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    supabase.storage.from_("profile_pictures").upload(
        path=user.username + ".jpg",
        file=image_data,
        file_options={"upsert": "true", "content-type": "image/jpeg"},
    )
    response = supabase.storage.from_("profile_pictures").create_signed_url(user.username + ".jpg", expires_in=120)
    return Response(status=status.HTTP_200_OK, data={"url": response["signedURL"]})

@api_view(["POST"])
def update_user_info(request):
    new_profile = request.data.get("profile")

    user: User = get_user(request.data.get("token"))
    if user is None:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    user.location = new_profile["location"]
    user.bio = new_profile["bio"]
    user.save()
    return Response(status=status.HTTP_200_OK)


def add_ordinal_suffix(day: int):
    if 10 <= day % 100 <= 20:
        return f"{day}th"
    else:
        suffixes = {1: "st", 2: "nd", 3: "rd"}
        return f"{day}{suffixes.get(day % 10, 'th')}"


def format_datetime_with_ordinal(datetime_object):
    day_with_suffix = add_ordinal_suffix(datetime_object.day)
    formatted_date = datetime_object.strftime(f"%B {day_with_suffix} %Y")
    return formatted_date


# returns the user's profile information
@api_view(["POST"])
def get_user_info(request):
    username: str = request.data.get("username")
    token: str = request.data.get("token")

    try:
        user: User = User.objects.get(username=username)
    except ObjectDoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    try:
        request_username: str = Session.objects.get(session_key=token).session_data
        is_own: bool = username == request_username
    except ObjectDoesNotExist:
        is_own: bool = False

    formatted_date: str = format_datetime_with_ordinal(user.date_joined)

    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    try:
        supa_response = supabase.storage.from_("profile_pictures").create_signed_url(user.username + ".jpg", expires_in=120)
        picture_url: str or None = supa_response["signedURL"]
    except StorageException:
        picture_url = None

    data = {
        "username": username,
        "date_joined": formatted_date,
        "profile_picture": picture_url,
        "bio": user.bio,
        "location": user.location,
        "isOwn": is_own
    }
    return Response(status=status.HTTP_200_OK, data=data)

@api_view(['POST'])
def get_username(request):
    token: str = request.data.get("token")
    try:
        username: str = Session.objects.get(session_key=token).session_data
    except ObjectDoesNotExist:
        username = ""
    return Response(data={"username": username}, status=status.HTTP_200_OK)


def get_user(token: str) -> User or None:
    try:
        username: str = Session.objects.get(session_key=token).session_data
        user = User.objects.get(username=username)
        return user
    except ObjectDoesNotExist:
        return None



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


@api_view(["POST"])
def logout(request):
    token = request.data

    try:
        Session.objects.get(session_key=token).delete()
    except ObjectDoesNotExist:
        pass
    return Response(status=status.HTTP_200_OK)


def generate_key():
    return get_random_string(40)

